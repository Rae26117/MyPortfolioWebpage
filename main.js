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
    ...new Set(portfolioData.map((project) => project.category)),
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

  // 生成專案列表
  const projectsHTML = portfolioData
    .map(
      (project) => `
    <li class="project-item active" data-filter-item data-category="${
      project.category
    }" ${project.videoUrl ? `data-video-url="${project.videoUrl}"` : ""}>
      <a href="#">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="${project.imageUrl}" alt="${project.title}" loading="lazy">
        </figure>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-category">${project.category}</p>
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

// Filter functionality
function filterFunc(selectedValue) {
  const filterItems = document.querySelectorAll("[data-filter-item]");

  filterItems.forEach((item) => {
    if (selectedValue === "all") {
      item.classList.add("active");
    } else if (selectedValue === item.dataset.category) {
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

  // 從 portfolioData 中查找對應的專案數據
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

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadPortfolioData();
});
