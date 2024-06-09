(function() {
  "use strict"; // Start of use strict

  var sidebar = document.querySelector('.sidebar');
  var sidebarToggles = document.querySelectorAll('#sidebarToggle, #sidebarToggleTop');

  if (sidebar) {
    var collapseElementList = [].slice.call(document.querySelectorAll('.sidebar .collapse'));
    var sidebarCollapseList = collapseElementList.map(function (collapseEl) {
      return new bootstrap.Collapse(collapseEl, { toggle: false });
    });

    // Đảm bảo tất cả các phần tử collapse đều đóng lúc ban đầu
    for (var bsCollapse of sidebarCollapseList) {
      bsCollapse.hide();
    }

    // Đảm bảo sidebar luôn khép lại lúc ban đầu
    document.body.classList.add('sidebar-toggled');
    sidebar.classList.add('toggled');

    for (var toggle of sidebarToggles) {
      // Toggle the side navigation
      toggle.addEventListener('click', function(e) {
        document.body.classList.toggle('sidebar-toggled');
        sidebar.classList.toggle('toggled');

        if (sidebar.classList.contains('toggled')) {
          for (var bsCollapse of sidebarCollapseList) {
            bsCollapse.hide();
          }
        }
      });
    }

    // Close any open menu accordions when window is resized below 768px
    window.addEventListener('resize', function() {
      var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

      if (vw < 768) {
        for (var bsCollapse of sidebarCollapseList) {
          bsCollapse.hide();
        }
      }
    });
  }

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  var fixedNavigation = document.querySelector('body.fixed-nav .sidebar');

  if (fixedNavigation) {
    fixedNavigation.addEventListener('mousewheel DOMMouseScroll wheel', function(e) {
      var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

      if (vw > 768) {
        var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
      }
    });
  }

  var scrollToTop = document.querySelector('.scroll-to-top');

  if (scrollToTop) {
    // Scroll to top button appear
    window.addEventListener('scroll', function() {
      var scrollDistance = window.pageYOffset;

      // Check if user is scrolling up
      if (scrollDistance > 100) {
        scrollToTop.style.display = 'block';
      } else {
        scrollToTop.style.display = 'none';
      }
    });
  }

})(); // End of use strict

function adjustScrollbarThumb() {
  const jwrapper = document.getElementById('japanese-jlpt');
  const contentHeight = jwrapper.scrollHeight;
  const visibleHeight = jwrapper.clientHeight;

  // Tính toán tỷ lệ chiều cao thanh trượt
  const thumbHeightRatio = visibleHeight / contentHeight;
  // Chiều cao thanh trượt
  const thumbHeight = Math.max(thumbHeightRatio * visibleHeight, 150); // Đảm bảo có kích thước tối thiểu

  // Tạo CSS động để thay đổi chiều cao thanh trượt
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
      .jwrapper::-webkit-scrollbar-thumb {
          height: ${thumbHeight}px !important;
      }
  `;
  document.head.appendChild(styleElement);
}

// Gọi hàm điều chỉnh khi nội dung thay đổi hoặc trang tải xong
window.addEventListener('load', adjustScrollbarThumb);
window.addEventListener('resize', adjustScrollbarThumb);
document.getElementById('japanese-jlpt').addEventListener('scroll', adjustScrollbarThumb);