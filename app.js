/* ==================================
   수정된 이력서 JavaScript - 애니메이션 추가 버전
   ================================== */

// 1. 설정 및 상수
const CONFIG = {
  TYPING_SPEED: 150, // 각 줄이 나타나는 속도를 150ms로 변경
  ANIMATION_DURATION: 300,
  SCROLL_THROTTLE: 16,
  NOTIFICATION_DURATION: 3000,
  BREAKPOINT_MOBILE: 768
};

// 2. 유틸리티 함수들
class Utils {
  // 스로틀링 함수
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // 디바운싱 함수
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 요소 선택 헬퍼
  static $(selector) {
    return document.querySelector(selector);
  }

  static $$(selector) {
    return document.querySelectorAll(selector);
  }

  // 클래스 토글 헬퍼
  static toggleClass(element, className) {
    if (element) {
      element.classList.toggle(className);
    }
  }

  // 이벤트 리스너 추가 헬퍼
  static addEvent(element, event, handler, options = {}) {
    if (element) {
      element.addEventListener(event, handler, options);
    }
  }

  // 알림 표시
  static showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '1000',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transform: 'translateX(400px)',
      transition: 'transform 0.3s ease-out',
      backgroundColor: type === 'success' ? '#556B2F' : '#dc3545',
      color: 'white'
    });

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, CONFIG.NOTIFICATION_DURATION);
  }
}

// 3. 네비게이션 관리
class Navigation {
  constructor() {
    this.navLinks = Utils.$$('.nav-link');
    this.sections = Utils.$$('.section');
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveLink();
  }

  bindEvents() {
    const throttledScroll = Utils.throttle(() => {
      this.updateActiveLink();
    }, CONFIG.SCROLL_THROTTLE);
    
    window.addEventListener('scroll', throttledScroll, { passive: true });

    this.navLinks.forEach(link => {
      Utils.addEvent(link, 'click', (e) => {
        e.preventDefault();
        this.scrollToSection(link.getAttribute('href').substring(1));
      });
    });
  }

  scrollToSection(sectionId) {
    const section = Utils.$(`#${sectionId}`);
    if (section) {
      const navHeight = Utils.$('.navigation').offsetHeight;
      const targetPosition = section.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  updateActiveLink() {
    const navHeight = Utils.$('.navigation').offsetHeight;
    const scrollPosition = window.pageYOffset + navHeight + 100;
    let currentSection = '';

    // 스크롤이 페이지 맨 아래에 있는지 확인
    const isAtBottom = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2; // 2px 여유

    if (isAtBottom) {
        currentSection = this.sections[this.sections.length - 1].id;
    } else {
        this.sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
          }
        });
    }

    this.navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// 4. 프로젝트 카드 관리


// 5. 애니메이션 관리
class AnimationManager {
  constructor() {
    this.summaryLines = Utils.$$('.summary-line');
    this.init();
  }

  init() {
    this.animateSummaryLines();
  }

  animateSummaryLines() {
    this.summaryLines.forEach((line, index) => {
      line.style.animationDelay = `${index * 0.2}s`;
    });
  }
}

// 6. 접근성 관리
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupSkipLinks();
    this.handleReducedMotion();
  }

  setupKeyboardNavigation() {
    Utils.addEvent(document, 'keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    Utils.addEvent(document, 'mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '메인 콘텐츠로 건너뛰기';
    skipLink.className = 'skip-link';
    
    Object.assign(skipLink.style, {
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: '#556B2F',
      color: 'white',
      padding: '8px',
      textDecoration: 'none',
      borderRadius: '4px',
      zIndex: '1000',
      transition: 'top 0.3s'
    });

    Utils.addEvent(skipLink, 'focus', () => {
      skipLink.style.top = '6px';
    });

    Utils.addEvent(skipLink, 'blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-normal', '0ms');
    }
  }
}



// 8. 연락처 관리
class ContactManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEmailHandling();
    this.setupPhoneHandling();
    this.setupExternalLinks();
  }

  setupEmailHandling() {
    const emailLink = Utils.$('a[href^="mailto:"]');
    if (emailLink) {
      Utils.addEvent(emailLink, 'click', async (e) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          e.preventDefault();
          
          try {
            await navigator.clipboard.writeText(emailLink.textContent);
            Utils.showNotification('이메일이 클립보드에 복사되었습니다!');
          } catch (err) {
            window.location.href = emailLink.href;
          }
        }
      });
    }
  }

  setupPhoneHandling() {
    const phoneLink = Utils.$('a[href^="tel:"]');
    if (phoneLink) {
      Utils.addEvent(phoneLink, 'click', () => {
        console.log('전화 링크 클릭:', phoneLink.href);
      });
    }
  }

  setupExternalLinks() {
    const externalLinks = Utils.$$('a[href^="http"], a[href^="https"]');
    externalLinks.forEach(link => {
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }
}

// 9. 프린트 관리
class PrintManager {
  constructor() {
    this.init();
  }

  init() {
    Utils.addEvent(window, 'beforeprint', () => {
      this.preparePrint();
    });

    Utils.addEvent(window, 'afterprint', () => {
      this.restoreAfterPrint();
    });
  }

  preparePrint() {
    const projectCards = Utils.$$('.project-card');
    projectCards.forEach(card => {
      card.classList.add('expanded');
    });
  }

  restoreAfterPrint() {
    const projectCards = Utils.$$('.project-card');
    projectCards.forEach(card => {
      card.classList.remove('expanded');
    });
  }
}

// 10. 메인 애플리케이션 클래스
class ResumeApp {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      Utils.addEvent(document, 'DOMContentLoaded', () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      this.components.navigation = new Navigation();
      
      this.components.animationManager = new AnimationManager();
      this.components.accessibilityManager = new AccessibilityManager();
      this.components.contactManager = new ContactManager();
      this.components.printManager = new PrintManager();

      

      this.setupAriaLiveRegion();

      console.log('이력서 애플리케이션이 성공적으로 로드되었습니다!');
    } catch (error) {
      console.error('애플리케이션 초기화 중 오류 발생:', error);
      Utils.showNotification('애플리케이션 로드 중 오류가 발생했습니다.', 'error');
    }
  }

  setupAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    document.body.appendChild(liveRegion);
  }
}

// 11. 애플리케이션 시작
const app = new ResumeApp();

// 12. 전역 스타일 추가
const additionalStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .skip-link:focus {
    top: 6px !important;
  }
  
  .keyboard-navigation *:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);