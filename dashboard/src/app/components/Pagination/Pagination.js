import React from "react";
import "./styles.css";

class Pagination extends React.Component {
  render() {
    const {
      firstPage,
      lastPage,
      nextPage,
      prevPage,
      totalPageCount,
      page,
      styles,
      isRange,
      isMap,
      length,
    } = this.props;
    let pageNumbers = [];
    for (let i = 1; i <= totalPageCount; i++) {
      while (i <= 4) {
        pageNumbers.push(i);
        break;
      }
      if (i > 4) {
        pageNumbers.push("....");
        pageNumbers.push(totalPageCount);
        break;
      }
      if (page > 4) {
        pageNumbers[1] = "....";
        pageNumbers[2] = page - 1;
        pageNumbers[3] = page;
        if (page < totalPageCount) {
          pageNumbers.push("....");
          pageNumbers.push(totalPageCount);
          break;
        }
        break;
      }
    }

    return (
      <nav>
        <ul
          className={`pagination ${!isMap && "justify-content-end"} g-3 d-flex`}
          style={styles}
        >
          <li
            className={`page-item ${page === firstPage && "disabled"}`}
            onClick={prevPage}
          >
            <a className="page-link" href="#">
              <i className="bx bx-chevron-left"></i>
            </a>
          </li>
          {this.props.page > 0 && this.props.totalPageCount > 0 && isRange ? (
            <div className="count-number">
              {/* {parseInt(this.props.page) * parseInt(this.props.limit) -
                parseInt(this.props.limit) +
                "-" +
                parseInt(this.props.page) * parseInt(this.props.limit)} */}
            </div>
          ) : (
            <div className="count-number">
              {this.props.length * this.props.page -
                (this.props.length - 1) +
                " - " +
                this.props.length * this.props.page +
                " of " +
                this.props.totalPageCount}
            </div>
          )}
          <li
            className={`page-item ${length === 0 && "disabled"}`}
            onClick={length !== 0 ? nextPage : null}
          >
            <a className="page-link" href="#">
              <i className="bx bx-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Pagination;
