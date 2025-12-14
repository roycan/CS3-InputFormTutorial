document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupPlaygrounds();
});

function setupNavbar() {
  const burger = document.querySelector('.navbar-burger');
  const menu = document.querySelector('.navbar-menu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    });
  }
}

function setupPlaygrounds() {
  const playgrounds = document.querySelectorAll('.playground-container');

  playgrounds.forEach(container => {
    const runBtn = container.querySelector('.run-btn');
    const resetBtn = container.querySelector('.reset-btn');
    const htmlEditor = container.querySelector('.editor-html');
    const jsEditor = container.querySelector('.editor-js');
    const preview = container.querySelector('.playground-preview');
    const consoleOutput = container.querySelector('.playground-console');

    // Store initial values
    const initialHtml = htmlEditor ? htmlEditor.value : '';
    const initialJs = jsEditor ? jsEditor.value : '';

    const logToConsole = (args) => {
      if (!consoleOutput) return;
      const line = document.createElement('div');
      line.className = 'console-line';
      line.textContent = '> ' + Array.from(args).map(a => String(a)).join(' ');
      consoleOutput.appendChild(line);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };

    const runCode = () => {
      // Clear console
      if (consoleOutput) consoleOutput.innerHTML = '';
      
      // Update HTML
      if (preview && htmlEditor) {
        preview.innerHTML = htmlEditor.value;
      }

      // Run JS
      if (jsEditor && jsEditor.value.trim() !== '') {
        try {
          // Create a sandboxed console
          const mockConsole = {
            log: (...args) => {
              console.log(...args); // Keep real log
              logToConsole(args);
            },
            error: (...args) => {
              console.error(...args);
              logToConsole(['Error:', ...args]);
            },
            warn: (...args) => {
              console.warn(...args);
              logToConsole(['Warning:', ...args]);
            }
          };

          // We need to execute the code in a way that it can access the DOM of the preview?
          // Actually, since we injected HTML into the current document's div, document.getElementById works.
          // But variables might conflict. We'll wrap in an IIFE.
          // Also we need to intercept console.log.
          
          // Execute JS code in global scope so functions are accessible to HTML event handlers
          const code = `
            const console = mockConsole;
            try {
              ${jsEditor.value}
            } catch(e) {
              console.error(e.message);
            }
          `;

          // Execute in global scope
          const run = new Function('mockConsole', code);
          run(mockConsole);

        } catch (e) {
          logToConsole(['Runner Error:', e.message]);
        }
      }
    };

    const resetCode = () => {
      if (htmlEditor) htmlEditor.value = initialHtml;
      if (jsEditor) jsEditor.value = initialJs;
      if (consoleOutput) consoleOutput.innerHTML = '';
      runCode();
    };

    if (runBtn) runBtn.addEventListener('click', runCode);
    if (resetBtn) resetBtn.addEventListener('click', resetCode);

    // Initial run
    runCode();
  });
}
