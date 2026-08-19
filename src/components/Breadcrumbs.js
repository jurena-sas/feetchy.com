import React from 'react';

const Breadcrumbs = () => {
    return (
        <div className="breadcrumbs">
			<div className="container">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<ul className="items">
							<li><a href="#">Home <i className="fa fa-angle-right"></i></a></li>
							<li className=""><strong>Blog</strong></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
    );
};

export default Breadcrumbs;