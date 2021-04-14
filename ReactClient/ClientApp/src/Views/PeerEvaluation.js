import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import ProjectList from "../components/ProjectList";
import axios from "axios";

const PeerEvaluation = () => {
	const authenticated =
		localStorage.getItem("id") &&
			localStorage.getItem("token") &&
			localStorage.getItem("expiration")
			? true
			: false;

	const history = useHistory();



	const [projectId, setProjectId] = useState(0);
	const [projectData, setProjectData] = useState([]);
	useEffect(() => {
		const getProjects = async () => {
			try {
				const { data } = await axios.get(`https://localhost:5001/api/Project/` + projectId);
				var mem = { projectId: projectId, members: [] }
				data.memberships.forEach(function (e) {
					mem.members.push({ id: e.id, name: e.student.firstName + " " + e.student.lastName, comment: "", rating: "5" });
				});
				setProjectData(mem);
			} catch (error) {
				console.log(error);
			}
		};
		if (projectId != 0) {
			getProjects();
		}

	}, [projectId]);
	if (authenticated) {
		console.log("logged in");
	} else {
		console.log("not logged in");
		history.push("/login");
	}

	function RatingChange(e) {
		var arr = projectData;
		
		arr.members[e.target.id].rating = e.target.value;
		setProjectData(arr);
		
	}
	function CommentChange(e) {
		var arr = projectData;
		arr.members[e.target.id].comment = e.target.value;
		setProjectData(arr);
	}
	const config = {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
		},
	};
   function Save() {

		var userId = localStorage.getItem("id");
		var date = new Date();
		projectData.members.forEach(async  (x) => {

			try {
				await axios
					.post(
						"https://localhost:5001/api/PeerEvaluation",
						{
							projectId: projectId,
							userEvaluatingId: userId,
							userBeingEvaluatedId: x.id,
							comments: x.comment,
							rating: x.rating,
							date: date
						},
						config
					)
					.then((res) => {
						console.log(res);
					});

			} catch (error) {
				
				console.log(error);
				
			}
		});
		history.push("/view-peerevaluation");

	}
	return <div>

		<select className="form-control" onChange={(e) => { setProjectId(e.target.value) }}>
			<option value="0">Select a Project</option>
			<ProjectList />
		</select>
		<br />
		<br />

		{projectData?.members?.map((e, i) => {

			return (

				<div className="card card-body">
					<h4>{e.name}</h4>

					<div className="form-group">
						<label>Comment:</label>
						<input id={i} className="form-control" type="text" onChange={CommentChange} />
					</div>


					<div className="form-group">
						<label>Rating:</label>
						<select id={i} onChange={RatingChange} className="form-control">
							<option>Select Rating</option>
							<option value="1" key="1">1</option>
							<option value="2" key="2">2</option>
							<option value="3" key="3">3</option>
							<option value="4" key="4">4</option>
							<option value="5" key="5">5</option>
						</select>
					</div>
				</div>

			)
		})}

		{projectData?.members?.length > 0 ? (
			<button type="button" onClick={Save} className="btn btn-primary">Save</button>
		) : (<div></div>)}


	</div>;
};

export default PeerEvaluation;
