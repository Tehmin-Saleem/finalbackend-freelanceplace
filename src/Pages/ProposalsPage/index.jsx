import React, { useState } from "react";
import { NewHeader, Proposalscard, Head } from "../../components/index";

import "./styles.scss"; // Import the SCSS file

const IndexPage = () => {
	// Example data for proposals
	const [proposals, setProposals] = useState([
		{
			id: 1,
			name: "Usman Shahid",
			title: "UI/UX Designer| Figma Expert| Graphic Designer",
			location: "Lahore, Punjab, Pakistan",
			rate: "$12.00/hr",
			earned: "$10k + earned",
			qualification: "Bachelor in design",
			timeline: "132 Hours",
			coverLetter:
				"I am an Upwork Verified and Experienced UI/UX/Graphic Designer with over 10+ years of quality experience in Websites, Mobile Apps, Branding, Editorials, Marketing Collateral and much more......",
			image: "/images/Profile.png",
		},
		{
			id: 2,
			name: "Usman Shahid",
			title: "UI/UX Designer| Figma Expert| Graphic Designer",
			location: "Lahore, Punjab, Pakistan",
			rate: "$200.00/Fixed",
			earned: "$10k + earned",
			qualification: "Bachelor in design",
			timeline: "One week",
			coverLetter:
				"I am an Upwork Verified and Experienced UI/UX/Graphic Designer with over 10+ years of quality experience in Websites, Mobile Apps, Branding, Editorials, Marketing Collateral and much more......",
			image: "/images/Profile.png",
		},
		{
			id: 3,
			name: "Usman Shahid",
			title: "UI/UX Designer| Figma Expert| Graphic Designer",
			location: "Lahore, Punjab, Pakistan",
			rate: "$200.00/Fixed",
			earned: "$10k + earned",
			qualification: "Bachelor in design",
			timeline: "One week",
			coverLetter:
				"I am an Upwork Verified and Experienced UI/UX/Graphic Designer with over 10+ years of quality experience in Websites, Mobile Apps, Branding, Editorials, Marketing Collateral and much more......",
			image: "/images/Profile.png",
		}
		// Add more proposals as needed
	]);

	return (
		<div className="proposals-page">
			<NewHeader />
			<h1 className="proposals-heading">Proposals</h1>
			<div className="proposals-container">
				{proposals.map((proposal) => (
					<Proposalscard key={proposal.id} {...proposal} />
				))}
			</div>
			<div className="pagination">
				<span>Rows per page</span>
				<select>
					<option>5</option>
					<option>10</option>
					<option>15</option>
				</select>
				<div className="page-controls">
					<span>1</span>
					<span>2</span>
					<span>3</span>
					<span>...</span>
					<span>10</span>
					<span>11</span>
					<span>12</span>
				</div>
				<span>Go to page</span>
				<input type="text" />
				<button>→</button>
			</div>
		</div>
	);
};

export default IndexPage;




