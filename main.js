async function loadMarkdown(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return marked.parse(text);
  } catch (err) {
    return "<p>⚠️ 無法載入內容。</p>";
  }
}

("use strict");

// Opening or closing side bar
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// Portfolio Data
let portfolioData = [];
let player;

// 載入作品集數據
async function loadPortfolioData() {
  try {
    const response = await fetch("portfolio.json");
    const data = await response.json();
    portfolioData = data.projects;
    generatePortfolioHTML();
  } catch (error) {
    console.error("Error loading portfolio data:", error);
  }
}

// 生成作品集 HTML
async function generatePortfolioHTML() {
  const projectList = document.querySelector(".project-list");
  const filterList = document.querySelector(".filter-list");
  const selectList = document.querySelector(".select-list");

  const categories = [
    "all",
    ...new Set(portfolioData.flatMap((project) => project.categories)),
  ];

  const filterHTML = categories
    .map(
      (category) => `
    <li class="filter-item">
      <button class="${category === "all" ? "active" : ""}" data-filter-btn>
        ${category.charAt(0).toUpperCase() + category.slice(1)}
      </button>
    </li>
  `
    )
    .join("");

  const selectHTML = categories
    .map(
      (category) => `
    <li class="select-item">
      <button data-select-item>${
        category.charAt(0).toUpperCase() + category.slice(1)
      }</button>
    </li>
  `
    )
    .join("");

  let projectsHTML = "";

  for (const project of portfolioData) {
    const markdownHTML = project.markdown
      ? await loadMarkdown(project.markdown)
      : "";

    const itemHTML = `
    <li class="project-item active" data-filter-item data-categories='${JSON.stringify(
      project.categories
    )}'>
      <a href="#">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="${project.imageUrl}" alt="${project.title}" loading="lazy">
        </figure>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-category">${project.categories.join(" & ")}</p>
        <div class="project-tags">
          ${
            project.tags
              ?.map((tag) => `<span class="project-tag">${tag}</span>`)
              .join("") || ""
          }
        </div>
      </a>
    </li>
  `;

    projectsHTML += itemHTML;
  }

  if (filterList) filterList.innerHTML = filterHTML;
  if (selectList) selectList.innerHTML = selectHTML;
  if (projectList) projectList.innerHTML = projectsHTML;

  initializePortfolioEvents();
}

// Portfolio events initialization
function initializePortfolioEvents() {
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });

  // Select items 事件
  selectItems.forEach((item) => {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  // Filter buttons 事件
  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });

  // 作品集項目點擊事件
  document.querySelectorAll(".project-item a").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openPortfolioModal(item);
    });
  });
}

// 修改過濾功能
function filterFunc(selectedValue) {
  const filterItems = document.querySelectorAll("[data-filter-item]");

  filterItems.forEach((item) => {
    const categories = JSON.parse(item.dataset.categories).map((cat) =>
      cat.toLowerCase()
    );
    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (categories.includes(selectedValue)) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Page Navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() == pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// Portfolio Modal Functions
async function openPortfolioModal(item) {
  const modal = document.getElementById("portfolioModal");
  const modalContent = modal.querySelector(".modal-content");
  const projectItem = item.closest(".project-item");

  const projectId = Array.from(
    document.querySelectorAll(".project-item")
  ).indexOf(projectItem);
  const projectData = portfolioData[projectId];

  // 更新模態框內容
  const modalImage = modalContent.querySelector(".modal-thumbnail img");
  modalImage.src = projectData.imageUrl;
  modalImage.alt = projectData.title;

  modalContent.querySelector(".modal-title").textContent = projectData.title;
  modalContent.querySelector(".modal-description").textContent =
    projectData.description;

  // 添加標籤到模態框
  const tagsHTML =
    projectData.tags
      ?.map((tag) => `<span class="modal-tag">${tag}</span>`)
      .join("") || "";

  const modalTitle = modalContent.querySelector(".modal-title");
  const existingTags = modalContent.querySelector(".modal-tags");
  if (existingTags) {
    existingTags.remove();
  }
  modalTitle.insertAdjacentHTML(
    "afterend",
    `<div class="modal-tags">${tagsHTML}</div>`
  );

  // YouTube 處理
  const videoContainer = modalContent.querySelector(".video-container");

  if (projectData.videoUrl && projectData.videoUrl.includes("youtube.com")) {
    const videoId = projectData.videoUrl.split("v=")[1].split("&")[0];

    if (player) {
      player.destroy();
    }

    player = new YT.Player("player", {
      playerVars: {
        playsinline: 1,
        autoplay: 0,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        showinfo: 0,
      },
      videoId: videoId,
      events: {
        onReady: function (event) {
          videoContainer.style.display = "block";
        },
      },
    });

    videoContainer.style.display = "block";
  } else {
    videoContainer.style.display = "none";
  }

  // ✅ 載入 Markdown 並插入
  const markdownContainer = modalContent.querySelector("#modalMarkdownContent");
  if (projectData.markdown && markdownContainer) {
    const html = await loadMarkdown(projectData.markdown);
    markdownContainer.innerHTML = html;

    // ✅ 語法高亮
    if (window.hljs) hljs.highlightAll();

    // ✅ 圖片點擊放大功能
    markdownContainer.querySelectorAll("img").forEach((img) => {
      img.addEventListener("click", () => {
        openImageModal(img.src);
      });
    });
  }


  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePortfolioModal() {
  const modal = document.getElementById("portfolioModal");
  const videoContainer = modal.querySelector(".video-container");

  if (player) {
    player.stopVideo();
    player.destroy();
    player = null;
  }

  videoContainer.style.display = "none";
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// YouTube API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  console.log("YouTube API Ready");
}

// Window resize event
window.addEventListener("resize", function () {
  const modal = document.getElementById("portfolioModal");
  if (modal.classList.contains("active") && player) {
    player.setSize(undefined, undefined);
  }
});

// Load resume data
async function loadResumeData() {
  try {
    const response = await fetch("resume.json");
    const data = await response.json();
    generateResumeHTML(data);
    generateWhatImDoingHTML(data.what_im_doing); // 新增這行
  } catch (error) {
    console.error("Error loading resume data:", error);
  }
}

// Generate HTML for resume sections
function generateResumeHTML(data) {
  // Generate Education HTML
  const educationList = document.getElementById("education-list");
  if (educationList) {
    educationList.innerHTML = data.education
      .map(
        (item) => `
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">${item.title}</h4>
        <span>${item.period}</span>
        <p class="timeline-text">${item.description}</p>
      </li>
    `
      )
      .join("");
  }

  // Generate Experience HTML
  const experienceList = document.getElementById("experience-list");
  if (experienceList) {
    experienceList.innerHTML = data.experience
      .map(
        (item) => `
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">${item.title}</h4>
        <span>${item.period}</span>
        <p class="timeline-text">${item.description}</p>
      </li>
    `
      )
      .join("");
  }

  // Generate Skills HTML (List version without icons)
  const skillsList = document.getElementById("skills-list");
  if (skillsList && data.skills) {
    skillsList.innerHTML = Object.entries(data.skills)
      .map(([category, skills]) => {
        const iconUrl = skills[0]?.icon || "";
        return `
      <li class="skills-group">
        <h3 class="h4 article-title">
          ${
            iconUrl
              ? `<ion-icon name="${iconUrl}" class="skills-title-icon"></ion-icon>`
              : ""
          }
          ${category}
        </h3>
        <ul class="skills-text-list">
          ${skills
            .map((skill) => `<li class="skills-text-item">${skill.name}</li>`)
            .join("")}
        </ul>
      </li>
    `;
      })
      .join("");
  }
}

// Generate HTML for What I'm Doing section
function generateWhatImDoingHTML(whatImDoingData) {
  const serviceList = document.querySelector(".about .service-list");
  if (serviceList) {
    serviceList.innerHTML = whatImDoingData
      .map(
        (item) => `
        <li class="service-item">
          <div class="service-icon-box">
            <ion-icon name="${item.icon}" style="font-size: 32px; color: var(--blue-crayola);"></ion-icon>
          </div>
          <div class="service-content-box">
            <h4 class="h4 service-item-title">${item.title}</h4>
            <p class="service-item-text">
              ${item.description}
            </p>
          </div>
        </li>
      `
      )
      .join("");
  }
}

// Initialize when DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  loadPortfolioData();
  loadResumeData();
});

// ✅ 綁定 modal 關閉按鈕
document
  .getElementById("portfolioModalClose")
  .addEventListener("click", closePortfolioModal);

// ✅ 點擊黑色背景也能關閉 modal
document.getElementById("portfolioModal").addEventListener("click", (e) => {
  if (e.target.id === "portfolioModal") {
    closePortfolioModal();
  }
});

// ✅ 顯示放大圖片
function openImageModal(src) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");
  img.src = src;
  modal.style.display = "block";
}

// ✅ 關閉放大圖片
function closeImageModal() {
  document.getElementById("imageModal").style.display = "none";
}
