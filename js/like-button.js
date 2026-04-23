// Like Button - Server-side counter
(function() {
  'use strict';
  
  // API endpoint: use relative path on main domain, absolute on GitHub Pages
  var API_URL = location.hostname === 'tinxg.github.io'
    ? 'https://www.ma5h1ro.site/api/likes'
    : '/api/likes';
  
  function initLikeButton() {
    var button = document.getElementById('card-info-btn');
    if (!button) {
      console.log('[Like Button] button not found');
      return false;
    }
    
    if (button.getAttribute('data-like-initialized')) {
      return true;
    }
    
    button.setAttribute('data-like-initialized', 'true');
    
    // Style the button
    button.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; background: linear-gradient(135deg, #ff6b6b, #ee5a5a); color: white; border-radius: 20px; text-decoration: none; font-size: 13px; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(238, 90, 90, 0.3); cursor: pointer; margin-top: 10px;';
    
    var icon = button.querySelector('i');
    if (icon) {
      icon.style.cssText = 'font-size: 14px; animation: heartbeat 1.5s ease-in-out infinite;';
    }
    
    var span = button.querySelector('span');
    if (!span) {
      span = document.createElement('span');
      button.appendChild(span);
    }
    span.textContent = '...'; // Loading
    
    button.removeAttribute('href');
    
    // Fetch current likes from server
    fetch(API_URL)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        span.textContent = data.total_likes.toLocaleString();
      })
      .catch(function() {
        span.textContent = '0';
      });
    
    // Click handler
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Disable button temporarily
      button.style.pointerEvents = 'none';
      
      // Send like to server
      fetch(API_URL, { method: 'POST' })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          span.textContent = data.total_likes.toLocaleString();
          showTooltip(button, '❤️ +1');
          
          // Click animation
          button.style.transform = 'scale(0.9)';
          setTimeout(function() {
            button.style.transform = 'scale(1)';
          }, 150);
        })
        .catch(function(err) {
          console.error('[Like Button] error:', err);
          showTooltip(button, '网络错误');
        })
        .finally(function() {
          button.style.pointerEvents = 'auto';
        });
    });
    
    // Hover effects
    button.addEventListener('mouseenter', function() {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 4px 12px rgba(238, 90, 90, 0.4)';
    });
    
    button.addEventListener('mouseleave', function() {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 2px 8px rgba(238, 90, 90, 0.3)';
    });
    
    console.log('[Like Button] initialized');
    return true;
  }
  
  // Tooltip
  function showTooltip(element, text) {
    var tooltip = document.createElement('div');
    tooltip.textContent = text;
    tooltip.style.cssText = 'position: fixed; background: #333; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; white-space: nowrap; z-index: 10000; pointer-events: none; opacity: 0; transition: opacity 0.3s;';
    
    var rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 30) + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    requestAnimationFrame(function() {
      tooltip.style.opacity = '1';
    });
    
    setTimeout(function() {
      tooltip.style.opacity = '0';
      setTimeout(function() {
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
      }, 300);
    }, 800);
  }
  
  // Add CSS
  var style = document.createElement('style');
  style.textContent = '@keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }';
  document.head.appendChild(style);
  
  // Initialize
  if (!initLikeButton()) {
    setTimeout(initLikeButton, 100);
    setTimeout(initLikeButton, 500);
    setTimeout(initLikeButton, 1000);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLikeButton);
    }
  }
})();
