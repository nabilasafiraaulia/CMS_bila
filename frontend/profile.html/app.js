import { Model } from './model.js';
import { HomeView, LoginView, CmsView, CameraView } from './views.js';
import { HomePresenter, LoginPresenter, CmsPresenter, CameraPresenter } from './presenters.js';

class App {
    constructor() {
        this.model = new Model();
        this.appContainer = document.getElementById('app');
        
        // Initialize views
        this.homeView = new HomeView();
        this.loginView = new LoginView();
        this.cmsView = new CmsView();
        this.cameraView = new CameraView();

        this.activePresenter = null;
        this.routes = {
            '#/': { view: this.homeView, presenterClass: HomePresenter },
            '#/profil': { view: this.homeView, presenterClass: HomePresenter, scrollTo: 'profil' },
            '#/about': { view: this.homeView, presenterClass: HomePresenter, scrollTo: 'about' },
            '#/goals': { view: this.homeView, presenterClass: HomePresenter, scrollTo: 'goals' },
            '#/favorite': { view: this.homeView, presenterClass: HomePresenter, scrollTo: 'favorite' },
            '#/artikel-section': { view: this.homeView, presenterClass: HomePresenter, scrollTo: 'artikel-section' },
            '#/contact': { view: this.homeView, presenterClass: HomePresenter, scrollTo: 'contact' },
            '#/login': { view: this.loginView, presenterClass: LoginPresenter },
            '#/cms': { view: this.cmsView, presenterClass: CmsPresenter },
            '#/camera': { view: this.cameraView, presenterClass: CameraPresenter }
        };
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRouting());
        // Handle initial load
        this.handleRouting();
    }

    async handleRouting() {
        let hash = window.location.hash || '#/';
        
        // Parse simple sub-hashes if any (e.g. sections in Home)
        let routeInfo = this.routes[hash];
        if (!routeInfo) {
            // Default fallback
            hash = '#/';
            routeInfo = this.routes[hash];
        }

        const { view, presenterClass, scrollTo } = routeInfo;

        // Optimize: If we are scrolling to a section on the homepage and HomePresenter is already active, just scroll
        if (presenterClass === HomePresenter && this.activePresenter instanceof HomePresenter) {
            if (scrollTo) {
                const el = document.getElementById(scrollTo);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    this.updateActiveNavbarLink(hash);
                }
            }
            return;
        }

        // Define DOM update callback
        const updateDOM = async () => {
            // 1. Cleanup old presenter to prevent memory leak (e.g. camera stream track stop)
            if (this.activePresenter) {
                if (typeof this.activePresenter.beforeLeave === 'function') {
                    this.activePresenter.beforeLeave();
                }
                if (this.activePresenter.destroy) {
                    this.activePresenter.destroy();
                }
                this.activePresenter = null;
            }

            // Clean up body classes (for themeing/layouts)
            document.body.className = '';
            if (hash === '#/login') {
                document.body.classList.add('login-page-active');
            } else if (hash === '#/cms') {
                document.body.classList.add('cms-page-active');
            }

            // 2. Instantiate and run new presenter
            this.activePresenter = new presenterClass(this.model, view);
            await this.activePresenter.init(this.appContainer);

            // 3. Scroll to target element if navigating to anchor
            if (scrollTo) {
                const el = document.getElementById(scrollTo);
                if (el) {
                    setTimeout(() => {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                }
            } else {
                window.scrollTo(0, 0);
            }

            this.updateActiveNavbarLink(hash);
        };

        // 4. View Transition API (progressive enhancement check)
        if (!document.startViewTransition) {
            await updateDOM();
        } else {
            const transition = document.startViewTransition(updateDOM);
            await transition.finished.catch(() => {});
        }
    }

    updateActiveNavbarLink(hash) {
        const navLinks = document.querySelectorAll('.navbar a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if link href matches current hash
            const href = link.getAttribute('href');
            if (href === hash || (hash === '#/' && href === '#')) {
                link.classList.add('active');
            }
        });
    }
}

// Start application once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();

    // Register Service Worker & Push Notification Subscription
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => {
                console.log('Service Worker registered successfully:', reg.scope);
                
                // Register for Push Notifications
                import('./utils/push.js').then(pushUtil => {
                    // Slight delay to not block initial page load
                    setTimeout(() => {
                        pushUtil.registerPushSubscription().then(sub => {
                            if (sub) {
                                console.log('Successfully subscribed to Web Push:', sub);
                            }
                        }).catch(err => {
                            console.warn('Web Push subscription failed:', err);
                        });
                    }, 2000);
                });
            })
            .catch(err => {
                console.error('Service Worker registration failed:', err);
            });
    }
});

// NOTE: File ini dulunya berisi legacy code fetch artikel dari `api/tampil.php` & `api/simpan.php`.
// Untuk mencegah konflik endpoint (relative path yang bisa mengarah ke port/host berbeda),
// legacy code tersebut harus dinonaktifkan. SPA sekarang menggunakan `Model` & `presenters`:
//   http://localhost:3000/api/artikel

