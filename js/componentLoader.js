document.addEventListener("DOMContentLoaded", function () {
    loadComponents();
});

async function loadComponents() {
    const elements = document.querySelectorAll('[data-component]');
    const promises = Array.from(elements).map(async (el) => {
        const componentPath = el.getAttribute('data-component');
        try {
            const response = await fetch(componentPath);
            if (response.ok) {
                const html = await response.text();
                // Replace element with HTML content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // If the component root is a single element (e.g. <nav> or <div class="card">), 
                // replace the placeholder with it directly to preserve layout
                if (tempDiv.firstElementChild) {
                    el.replaceWith(tempDiv.firstElementChild);
                } else {
                    el.innerHTML = html;
                }
            } else {
                console.error(`Failed to load component: ${componentPath}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
        }
    });

    await Promise.all(promises);

    // After all HTML components are loaded and inserted into the DOM, load the JS files
    // Thêm timestamp để browser không dùng bản cache cũ
    const ts = new Date().getTime();
    loadScripts([
        "https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.2/raphael-min.js",
        "./js/const.js?v=" + ts,
        "./js/data/kanjiDataJSON.js?v=" + ts,
        "./js/data/wordDataJSON.js?v=" + ts,
        "./js/dmak.js?v=" + ts,
        "./js/dmakLoader.js?v=" + ts,
        "./js/drawKanji.js?v=" + ts,
        "assets/js/theme.js?v=" + ts,
        "./js/app.js?v=" + ts
    ]);
}

function loadScripts(scripts) {
    if (scripts.length === 0) {
        // Trigger window resize or custom events if needed
        window.dispatchEvent(new Event('resize'));
        return;
    }

    const src = scripts.shift();
    const scriptEl = document.createElement('script');
    scriptEl.src = src;
    scriptEl.async = false; // Maintain execution order
    scriptEl.onload = function () {
        loadScripts(scripts);
    };
    scriptEl.onerror = function () {
        console.error(`Error loading script: ${src}`);
        loadScripts(scripts); // Continue with next scripts
    };
    document.body.appendChild(scriptEl);
}
