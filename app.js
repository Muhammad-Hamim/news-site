let fetchData = [];
const newsCategories = document.getElementById("news-categories");
let prevCategory = null;

const loadNewsCategories = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/news/categories"
  );
  const data = await res.json();
  displayNewsCategories(data.data.news_category);
};

const displayNewsCategories = (categories) => {
  categories.forEach((element) => {
    // console.log(element);
    const category = document.createElement("a");
    category.classList.add("tab");
    category.innerHTML = `${element.category_name}`;
    newsCategories.appendChild(category);

    category.addEventListener("click", () => {
      // Remove the 'tab-active' class from the previously clicked category, if any
      if (prevCategory) {
        prevCategory.classList.remove("tab-active");
      }
      // Add the 'tab-active' class to the currently clicked category
      category.classList.add("tab-active");
      // loadCategroyNews when click on any category
      loadCategoryNews(element.category_id, element.category_name);
      // Set the currently clicked category as the previously clicked category for next time
      prevCategory = category;
    });
  });
};

const loadCategoryNews = async (id, category_name) => {
  const url = `https://openapi.programming-hero.com/api/news/category/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  fetchData = data.data;
  displayCategoryNews(data.data, category_name);
};
const displayCategoryNews = (data, category_name) => {
  const showAllNews = document.getElementById("show-all-news");
  showAllNews.innerHTML = ``;
  // console.log(data);
  document.getElementById("news-count").innerText = data.length;
  document.getElementById("news-category").innerText = category_name;
  data.forEach((element) => {
    // console.log(element);
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-base-100 shadow-xl rounded-xl px-8 py-10 my-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <figure class="lg:col-span-1"><img class="object-cover h-full w-full" src="${
          element.thumbnail_url
        }" alt="Movie"/></figure>
        <div class="lg:col-span-4 h-full">
          <div class="h-1/2">
            <h2 class="text-xl lg:text-3xl font-semibold">${element.title}</h2>
            <p class="lg:text-lg mb-4">${element.details.slice(0, 300)}</p>
            <p class="lg:text-lg mb-4">${element.details.slice(300, 500)}</p>
          </div>
          <div class="h-1/2 flex items-end">
            <div class="w-full flex flex-wrap gap-3 lg:gap-0 justify-between items-center">
              <div class="flex items-center gap-2">
              <img class="w-10 h-10 rounded-full" src="${element.author.img}"/>
              <div>
                <h1>${
                  element.author.name ? element.author.name : "Not available"
                }</h1>
                <h1>${element.author.published_date}</h1>
              </div>
              </div>
              <!-- authore info -->
              <div class="flex items gap-2">
                  <p class="text-lg"><i class="fa-sharp fa-solid fa-eye"></i></p> 
                  <p class="text-lg">${
                    element.total_view ? element.total_view : "Not available"
                  }</p>
              </div>
              <!-- view info -->
              
              <div class="flex items-center gap-2">
                ${generateStarts(element.rating.number)}
                  <p>${element.rating.number}</p>
              </div>
              <!-- rating -->
              <div>
                <label for="my-modal-5" class="cursor-pointer text-[#570df8] text-2xl" onclick="loadDetails('${
                  element._id
                }')" >
                  <i class="fa-solid fa-arrow-right-long"></i>
                </label>
              </div>
              <!-- details -->
            </div>
          </div>
        </div>
      </div>
    `;
    showAllNews.appendChild(card);
  });
};

const loadDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/news/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayDetails(data.data[0]);
};
const displayDetails = (news) => {
  const modal = document.getElementById('modal');
  modal.innerHTML = '';
  console.log(news);
  const { title, author, details, image_url, total_view, rating, others_info } =
    news;
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = `
      <div class="modal-box w-11/12 max-w-5xl relative">
          <img class="w-full" src="${image_url}" />
          <h3 class="mt-5 font-bold text-lg">${title} ${
    others_info.is_trending
      ? `<span class="badge badge-secondary">Trending</span>`
      : ""
  }</h3>
          <p class="py-4">${details}</p>
          <div class="h-1/2 flex items-end">
            <div class="w-full flex flex-wrap gap-3 lg:gap-0 justify-between items-center">
              <div class="flex items-center gap-2">
              <img class="w-10 h-10 rounded-full" src="${author.img}"/>
              <div>
                <h1>${author.name ? author.name : "Not available"}</h1>
                <h1>${author.published_date}</h1>
              </div>
              </div>
              <!-- authore info -->
              <div class="flex items gap-2">
                  <p class="text-lg"><i class="fa-sharp fa-solid fa-eye"></i></p> 
                  <p class="text-lg">${
                    total_view ? total_view : "Not available"
                  }</p>
              </div>
              <!-- view info -->
              
              <div class="flex items-center">
               ${generateStarts(rating.number)}
               <p>${rating.number}</p>
              </div>
              <!-- rating -->
            </div>
          </div>
          <div class="modal-action absolute top-0 right-8">
            <label for="my-modal-5" class="text-4xl text-[#570df8] cursor-pointer"><i class="fa-solid fa-xmark"></i></label>
          </div>
          <div class="modal-action">
            <label for="my-modal-5" class="btn">Close</label>
          </div>
        </div>
  `;
  modal.appendChild(modalContainer);
}

const showTrending = () => {
  let trendingNews = fetchData.filter(trending => trending.others_info.is_trending === true);
  console.log(trendingNews);
  const categoryName = document.getElementById('news-category').innerText;
  displayCategoryNews(trendingNews, categoryName);
}
const TodaysPick = () => {
  let todaysPick = fetchData.filter(
    (todayspick) => todayspick.others_info.is_todays_pick === true
  );
  console.log(todaysPick);
  const categoryName = document.getElementById('news-category').innerText;
  displayCategoryNews(todaysPick, categoryName);
}

const generateStarts = (rating)=>{
  let ratingHTML = '';
  for (let i = 1; i <= Math.floor(rating); i++){
    ratingHTML += `<i class="fa-solid fa-star"></i>`;
  } 
  if (rating - Math.floor(rating) > 0) {
    ratingHTML += `<i class="fa-solid fa-star-half"></i>`;
  }
  return ratingHTML;
}