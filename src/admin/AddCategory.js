import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isAutheticated } from "../auth/helper";
import Base from "../core/Base";
import { createCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAutheticated();

  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-warning mb-3" to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  );

  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //BACKEND REQUEST CALL
    createCategory(user._id, token, { name })
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      })
      .catch((err) => console.log(err));
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category created Successfully</h4>;
    }
  };

  const errorMessage = () => {
    if (error) {
      return <h4 className="text-danger">Category cannot be created.</h4>;
    }
  };

  const categoryForm = () => (
    <form className="form-group">
      <p className="lead">Enter Category</p>
      <input
        type="text"
        className="form-control my-3"
        onChange={handleChange}
        value={name}
        autoFocus
        required
        placeholder="for Ex Web technology"
      />
      <button onClick={onSubmit} className="btn btn-outline-success">
        Create category
      </button>
    </form>
  );

  return (
    <div>
      <Base
        title="Create new category Here.."
        description="Add a new category for Courses"
        className="container bg-success p-4"
      >
        <div className="row bg-white rounded">
          <div className="col-md-8 offset-ms-2">
            {successMessage()}
            {errorMessage()}
            {categoryForm()}
            {goBack()}
          </div>
        </div>
      </Base>
    </div>
  );
};

export default AddCategory;
