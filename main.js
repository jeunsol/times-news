// async function getNews() { //일시정지(비동기함수)
//   let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
//   console.log("uuu", url);

//   const response = await fetch(url); //url 호출 기다림
//   console.log("rrr", response);
// }
// getNews();
// for (let i = 0; i < 20; i++) {
//   console.log("after", i);
// }

const API_KEY = `470474beeee24e818762197d21ef2ffe`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
console.log("메뉴", menus);
menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByCategory(event)));
let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page); //$page=page
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url); //url 호출
    // console.log("try문", response);
    const data = await response.json();
    console.log("데이터", data.articles);

    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }

      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      // console.log("뉴스", newsList);
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    // console.log("error", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
  console.log("주소", url);

  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("카테고리", category);
  url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
  // console.log("카테고리별 데이터", data);

  getNews();
};

const getNewsByKeyword = async () => {
  console.log("키워드");

  const keyword = document.getElementById("search-input").value;
  console.log(keyword);

  url = new URL(`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);

  getNews();
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
  <div class="col-lg-4">
    <img class="news-img-size" src=${news.urlToImage}>
  </div>
  <div class="col-lg-8">
    <h2>${news.title}</h2>
    <p>${news.description}</p>
    <div>${news.source.name} * ${news.publishedAt}</div>
  </div>
</div>`
    )
    .join("");
  // console.log(newsHTML);

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  // totalResult, page, totalPages, pageSize, groupSize

  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);

  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);

  // lastPage
  let lastPage = pageGroup * groupSize;
  // 마지막 pageGroup이 groupSize보다 작을 경우에는, lastPage는 totalPages로 보여줘야한다.
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  // firstPage
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  // first~last
  // let paginationHTML = `<li class="page-item ${page === 1 ? `disabled` : ""}" onclick="moveToPage(${page-1})"><a class="page-link">Previous</a></li>`;
  // const isDisabled = (page === 1) ? 'disabled' : '';
  let paginationHTML = `<li class="page-item ${page === firstPage ? 'disabled' : ''}" ${page === firstPage ? '' : `onclick="moveToPage(${(page-1)})"`}><a class="page-link">Previous</a></li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i === page ? `active` : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item ${page === totalPages ? 'disabled' : ''}" ${page === totalPages ? '' : `onclick="moveToPage(${(page+1)})"`}><a class="page-link">Next</a></li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;

  // <nav aria-label="Page navigation example">
  //   <ul class="pagination">
  //     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //     <li class="page-item"><a class="page-link" href="#">1</a></li>
  //     <li class="page-item"><a class="page-link" href="#">2</a></li>
  //     <li class="page-item"><a class="page-link" href="#">3</a></li>
  //     <li class="page-item"><a class="page-link" href="#">Next</a></li>
  //   </ul>
  // </nav>
};

const moveToPage = (pageNum) => {
  console.log("moveToPage", pageNum);
  page = pageNum;
  getNews();
};

getLatestNews();

//1. 버튼들에 클릭이벤트 주기
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기
