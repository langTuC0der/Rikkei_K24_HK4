document.addEventListener("DOMContentLoaded", () => {
  // Navigation State
  let currentLesson = "s6_l1"; // "s6_l1", "s6_l2", "s6_l3", "s6_l4", "s6_quiz"

  // Switch Lesson Logic
  function switchLesson(lessonId) {
    currentLesson = lessonId;

    // Update active state in sidebar nav
    document.querySelectorAll(".lesson-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-lesson") === lessonId);
    });

    // Hide all lesson sections, show active one
    document.querySelectorAll(".lesson-section").forEach(sec => {
      sec.classList.toggle("active", sec.getAttribute("id") === lessonId);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize/Render Mermaid diagrams in the active lesson if it is the diagrams tab
    if (lessonId !== "s6_quiz") {
      setTimeout(() => {
        initializeMermaidForLesson(lessonId);
      }, 100);
    }
  }

  // Setup Sidebar Lesson Clicks
  document.querySelectorAll(".lesson-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lessonId = btn.getAttribute("data-lesson");
      switchLesson(lessonId);
    });
  });

  // Tab switching logic within lessons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      const lessonSection = btn.closest(".lesson-section");
      
      // Update tab buttons state
      lessonSection.querySelectorAll(".tab-btn").forEach(tBtn => {
        tBtn.classList.toggle("active", tBtn === btn);
      });

      // Update tab panes state
      lessonSection.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.toggle("active", pane.getAttribute("id") === `${lessonSection.id}_pane_${tabId}`);
      });

      // Re-render Mermaid if switching to diagrams tab
      if (tabId === "diagram") {
        setTimeout(() => {
          initializeMermaidForLesson(lessonSection.id);
        }, 100);
      }
    });
  });

  // Copy Code Functionality
  window.copyCode = function(button, elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) return;

    const originalHTML = button.innerHTML;
    
    // Copy to clipboard
    navigator.clipboard.writeText(codeElement.textContent).then(() => {
      button.innerHTML = '<i class="fas fa-check"></i> Đã copy!';
      button.style.borderColor = "var(--success)";
      button.style.color = "var(--success)";

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.borderColor = "";
        button.style.color = "";
      }, 2000);
    }).catch(err => {
      console.error("Lỗi copy: ", err);
    });
  };

  // Mermaid Render Safe Trigger
  function initializeMermaidForLesson(lessonId) {
    const container = document.getElementById(lessonId);
    if (!container) return;
    
    // Find unrendered mermaid blocks inside the visible tab
    const mermaidPane = container.querySelector(".tab-pane.active .mermaid");
    if (mermaidPane && !mermaidPane.hasAttribute("data-processed")) {
      try {
        if (window.mermaid) {
          window.mermaid.init(undefined, mermaidPane);
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    }
  }

  // --- INTERACTIVE QUIZ SYSTEM ---
  document.querySelectorAll(".quiz-card").forEach(card => {
    const options = card.querySelectorAll(".quiz-option");
    const explanation = card.querySelector(".quiz-explanation");

    options.forEach(opt => {
      opt.addEventListener("click", () => {
        // If already answered, do nothing
        if (card.classList.contains("answered")) return;

        card.classList.add("answered");
        const isCorrect = opt.getAttribute("data-correct") === "true";

        // Mark clicked option
        if (isCorrect) {
          opt.classList.add("correct");
        } else {
          opt.classList.add("incorrect");
          // Find and highlight correct option
          options.forEach(o => {
            if (o.getAttribute("data-correct") === "true") {
              o.classList.add("correct");
            }
          });
        }

        // Show explanation
        if (explanation) {
          explanation.style.display = "block";
        }
      });
    });
  });

  // Prompt Drawer Toggle
  document.querySelectorAll(".prompt-drawer-header").forEach(header => {
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      const arrow = header.querySelector("i");
      
      if (body.style.display === "none" || !body.style.display) {
        body.style.display = "block";
        arrow.style.transform = "rotate(180deg)";
      } else {
        body.style.display = "none";
        arrow.style.transform = "rotate(0deg)";
      }
    });
  });
});
