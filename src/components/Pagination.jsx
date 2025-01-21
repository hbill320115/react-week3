function Pagination({pageInfo,handlePageChange}){
    return (
        <div className="d-flex justify-content-center">
            <nav>
                <ul className="pagination">
                    <li className="page-item">
                    <a
                        className={`page-link ${!pageInfo.has_pre && "disabled"}`}
                        onClick={() => handlePageChange(pageInfo.current_page - 1)}
                        href="#"
                    >
                        上一頁
                    </a>
                    </li>
                    {/* 用total_pages來map頁數 */}
                    {Array.from({ length: pageInfo.total_pages }).map(
                    (_, index) => {
                        return (
                        <li
                            className={`page-item ${
                            pageInfo.current_page === index + 1 && "active"
                            }`}
                            key={index}
                        >
                            {" "}
                            {/* 判斷所在頁數加上active */}
                            <a
                            onClick={() => handlePageChange(index + 1)}
                            className="page-link"
                            href="#"
                            >
                            {index + 1}
                            </a>
                        </li>
                        );
                    }
                    )}
                    <li className="page-item">
                    <a
                        className={`page-link ${!pageInfo.has_next && "disabled"}`}
                        href="#"
                        onClick={() => handlePageChange(pageInfo.current_page + 1)}
                    >
                        下一頁
                    </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
export default Pagination;