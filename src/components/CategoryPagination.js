import React from 'react';

const CategoryPagination = () => {
    return (
        <div class="pagination-area mt-40 pt-40">
            <div class="pagination-text">
                <p>Items 1-16 of 17</p>
            </div>
            <div class="bedroom-pagination">
                <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li><a href="#">Page</a></li>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li>
                            <a href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default CategoryPagination;