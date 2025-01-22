function Pagination({ pageInfo, handlePageChange }) {
  return (
    <div className="d-flex justify-content-center">
      <nav>
        <ul className="pagination">
          {/* ===============【上一頁】============== */}
          <li className="page-item">
            <a
              href="#"
              className={`page-link ${!pageInfo.has_pre && "disabled"}`}
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
            >
              上一頁
            </a>
          </li>
          {/* ===============【頁數】============== */}
          {Array.from({ length: pageInfo.total_pages }).map((_, index) => {
            return (
              <li
                className={`page-item ${
                  pageInfo.current_page === index + 1 && "active"
                }`}
                key={index}
              >
                {" "}
                {/* 所在頁數加上active */}
                <a
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </a>
              </li>
            );
          })}
          {/* ===============【下一頁】============== */}
          <li className="page-item">
            <a
              href="#"
              className={`page-link ${!pageInfo.has_next && "disabled"}`}
              onClick={() => handlePageChange(pageInfo.current_page + 1)}
            >
              下一頁
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default Pagination;
