import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import CourseList from "../components/CourseList";
import ProjectCategoryList from "../components/ProjectCategoryList";
import MembersList from "../components/MembersList";
import axios from "axios";
const CreateProject = () => {
	const authenticated =
		localStorage.getItem("id") &&
			localStorage.getItem("token") &&
			localStorage.getItem("expiration")
			? true
			: false;

	const [courseId, setCourseId] = useState(0);
	const [projectCategoryId, setProjectCategoryId] = useState(0);
	const history = useHistory();
	const [studentId, setStudentId] = useState(0);
	

	if (authenticated) {
		console.log("logged in");
	} else {
		console.log("not logged in");
		history.push("/login");
	}
	const config = {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
		},
	};
	async function Create() {

		if (courseId == 0) {
			alert('select course');
			return;
		}
		if (projectCategoryId == 0) {
			alert('select project category');
			return;
		}
		if (studentId == 0) {
			alert('select member');
			return;
		}
		try {
			await axios
				.post(
					"https://localhost:5001/api/Project",
					{
						projectCategoryId: projectCategoryId,
						courseId: courseId,
					},
					config
				)
				.then((res) => {

					axios
						.post(
							"https://localhost:5001/api/Membership",
							{
								id: studentId,
								projectId: res.data.projectId,
							},
							config
						)
						.then((res) => {


							console.log(res);
							history.push("/view-project");
						});


				});
			
		} catch (error) {
			
			console.log(error);
		}
	}
	
	
	return (
		<>
			<h3>Create Project</h3>
			<div className="panel panel-default mt-4">
				<form>
					<div className="form-group">
						<label>Course Name:</label>
						<select onChange={(e) => { setCourseId(e.target.value) }} className="form-control">
							<option>Select Course</option>
							<CourseList />
						</select>
					</div>

					<div className="form-group">
						<label>Project Category:</label>
						<select className="form-control" onChange={(e) => { setProjectCategoryId(e.target.value) }}>
							<option>Select Project Category</option>
							<ProjectCategoryList />
						</select>
					</div>

					<div className="form-group">
						<label>Members:</label>
						<select onChange={(e) => { setStudentId(e.target.value) }} className="form-control">
							<option>Select Student</option>
							<MembersList />
						</select>
					</div>
					<button type="button" onClick={Create} className="btn btn-primary">Create</button>
				</form>
			</div>
		</>
	);
};

export default CreateProject;
