import React, { useState } from 'react';
import { mockResponses } from './apiData';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [progress, setProgress] = useState(0);

  // Handle Dropdown Change
  const handleFormTypeChange = (event) => {
    const selectedType = event.target.value;
    setFormType(selectedType);
    setFormFields(mockResponses[selectedType]?.fields || []);
    setFormData({});
    setProgress(0);
  };

  // Handle Input Change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      calculateProgress(updatedData);
      return updatedData;
    });
  };

  // Calculate Progress
  const calculateProgress = (data) => {
    const totalRequired = formFields.filter((field) => field.required).length;
    const filledRequired = formFields.filter((field) => field.required && data[field.name]).length;
    setProgress((filledRequired / totalRequired) * 100);
  };

  // Handle Form Submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmittedData((prev) => ({
      ...prev,
      [formType]: [...(prev[formType] || []), formData],
    }));
    setFormType("");
    setFormFields([]);
    setFormData({});
    setProgress(0);

    toast.success("Form submitted successfully!");
  };

  return (
    <div className='bg-violet-600 min-h-screen '>

    <div className="p-6 max-w-3xl mx-auto text-center bg-cyan-500 border-4 border-red-700 rounded-xl ">
      <h1 className="text-2xl font-bold mb-6">Dynamic Form</h1>

      <ToastContainer />
      
      <select
        value={formType}
        onChange={handleFormTypeChange}
        className="border-4 border-green-600 rounded p-2 mb-4 w-full hover:bg-green-300 "
      >
        <option value="">Select Form Type</option>
        {Object.keys(mockResponses).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

        {/* form fields  */}
      {formFields.length > 0 && (
        <form onSubmit={handleSubmit} className="space-y-4 ">
          {formFields.map((field) => (
            <div key={field.name}>
              <label className="block mb-1 font-medium">{field.label}</label>
              {field.type === "dropdown" ? (
                <select
                  name={field.name}
                  required={field.required}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full hover:bg-green-300 "
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full hover:bg-green-300"
                />
              )}
              {field.required && !formData[field.name] && (
                <span className="text-red-500 text-sm">This field is required.</span>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500 text-xl text-white rounded px-8 py-3 hover:bg-green-300 hover:text-red-600"
          >
            Submit
          </button>
        </form>
      )}

      {/* Progress Bar */}
      {formFields.length > 0 && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{Math.round(progress)}% Complete</p>
        </div>
      )}

      {/* Submitted Data  */}
      <div className="mt-8">
        {Object.keys(submittedData).map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-xl font-bold mb-4">{category}</h2>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  {submittedData[category]?.length > 0 &&
                    Object.keys(submittedData[category][0]).map((key) => (
                      <th key={key} className="border p-2">
                        {key}
                      </th>
                    ))}
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData[category]?.map((data, index) => (
                  <tr key={index}>
                    {Object.values(data).map((value, idx) => (
                      <td key={idx} className="border p-2">
                        {value}
                      </td>
                    ))}
                    <td className="border p-2">
                      <button className="text-blue-500 mr-2">Edit</button>
                      <button className="text-red-500">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>

    </div>
  );
};

export default DynamicForm;
