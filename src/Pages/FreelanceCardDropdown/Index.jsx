import React from "react";
// there can be a masla here
import {FreelancerCards} from "../../components/index";
import {JobsDropdwon} from "../../svg/index";
import "./style.scss";

const FreelancerCards = ()=>{
  

  return (
    <div className="container">
      <div className="header">
        <h3 className="headerItem">
          Skills
          <JobsDropdwon />
        </h3>
        <h3 className="headerItem">
          Categories
          <JobsDropdwon />
        </h3>
        <h3 className="headerItem">
          Availability
          <JobsDropdwon />
        </h3>
        <h3 className="headerItem">
          Location
          <JobsDropdwon />
        </h3>
        <h3 className="headerItem lastHeaderItem">
          Ratings
          <JobsDropdwon />
        </h3>
      </div>

      {/* <div className="cardsWrapper">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="cardWrapper">
            <Card freelancer={freelancer} />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default FreelancerCards;
