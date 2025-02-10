"use strict";

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
function generatePortfolioHTML() {
  const projectList = document.querySelector(".project-list");
  const filterList = document.querySelector(".filter-list");
  const selectList = document.querySelector(".select-list");

  // 獲取所有唯一的分類
  const categories = [
    "all",
    ...new Set(portfolioData.flatMap((project) => project.categories)),
  ];

  // 生成篩選按鈕
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

  // 生成下拉選單選項
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

  // 生成專案列表，現在使用 data-categories 來存儲多個分類
  const projectsHTML = portfolioData
    .map(
      (project) => `
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
 `
    )
    .join("");

  // 更新 DOM
  if (filterList) filterList.innerHTML = filterHTML;
  if (selectList) selectList.innerHTML = selectHTML;
  if (projectList) projectList.innerHTML = projectsHTML;

  // 重新綁定事件
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
    const categories = JSON.parse(item.dataset.categories);
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
function openPortfolioModal(item) {
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

  // 在標題後面插入標籤容器
  const modalTitle = modalContent.querySelector(".modal-title");
  const existingTags = modalContent.querySelector(".modal-tags");
  if (existingTags) {
    existingTags.remove();
  }
  modalTitle.insertAdjacentHTML(
    "afterend",
    `<div class="modal-tags">${tagsHTML}</div>`
  );

  const videoContainer = modalContent.querySelector(".video-container");

  if (projectData.videoUrl) {
    if (projectData.videoUrl.includes("youtube.com")) {
      const videoId = projectData.videoUrl.split("v=")[1].split("&")[0];

      if (player) {
        player.destroy();
      }

      // 更新的 YouTube 播放器配置
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
          onStateChange: function (event) {
            // 播放狀態改變時的處理
          },
        },
      });

      videoContainer.style.display = "block";
    }
  } else {
    videoContainer.style.display = "none";
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

  // Generate Skills HTML
  const skillsList = document.getElementById("skills-list");
  if (skillsList) {
    skillsList.innerHTML = data.skills
      .map(
        (skill) => `
      <li class="service-item">
        <div class="service-icon-box">
          <img src="${skill.icon}" alt="${skill.name}" width="40">
        </div>
        <div class="service-content-box">
          <h4 class="h4 service-item-title">${skill.name}</h4>
        </div>
      </li>
    `
      )
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
            <img src="${item.icon}" alt="${item.title}" width="40" />
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
document.addEventListener("DOMContentLoaded", () => {
  loadPortfolioData();
  loadResumeData();
});
