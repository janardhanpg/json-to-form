
# Dynamic Form Generator

A simple React application that dynamically generates a form based on JSON input. The form is rendered based on the provided field configurations (e.g., text inputs, radio buttons, selects) with validation and error handling using react-hook-form.


## Features

- Dynamic form rendering based on JSON configuration.
- Form validation using react-hook-form.
- Supports multiple field types: text input, radio buttons, select dropdown, and textarea.
- JSON input can be directly modified to change the form structure.
- Error messages are displayed for invalid form submissions.


## Prerequirements

Before running this project, ensure you have the following installed:

- Node.js (v14 or later) - Download Node.js
- npm (Node Package Manager) - comes with Node.js.
## Setup Instructions

Follow these steps to set up the project locally:

-  Clone the Repository: First, clone the repository to your local machine.
````
git clonehttps://github.com/janardhanpg/json-to-form.git
cd dynamic-form-generator

````
- Install Dependencies: Once you're in the project directory, install the required dependencies using npm. 
```
npm install
```
- Run the Application: To run the project locally, use the following command:
```
npm run dev
```
## How the Application Works

- JSON Input: The user can input a JSON object in the left tab. This JSON defines the form's structure, including the fields (e.g., text input, radio buttons, selects).

- Form Generation: Based on the input JSON, the application will generate the form on the right side of the screen. The form includes validation (e.g., required fields, regex validation) based on the JSON schema.

- Form Validation: The form uses react-hook-form for validation. If a required field is missing or an input doesn't match the validation pattern, the form will display an error message.

- Form Submission: After filling out the form, the user can submit it, and the submitted data will be logged to the console and user can download the formdata in json format.
## Example JSON Structure

To use the form generator, you can provide a JSON object with the following structure:

```
{
  "formTitle": "User Information",
  "formDescription": "Please fill out the form below.",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your full name",
      "validation": {
        "pattern": "^[a-zA-Z ]+$",
        "message": "Only alphabetic characters are allowed."
      }
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "Enter your email",
      "validation": {
        "pattern": "^\\S+@\\S+\\.\\S+$",
        "message": "Please enter a valid email address."
      }
    },
    {
      "id": "gender",
      "type": "radio",
      "label": "Gender",
      "required": true,
      "options": [
        { "value": "male", "label": "Male" },
        { "value": "female", "label": "Female" }
      ]
    },
    {
      "id": "country",
      "type": "select",
      "label": "Country",
      "required": true,
      "options": [
        { "value": "usa", "label": "United States" },
        { "value": "canada", "label": "Canada" },
        { "value": "india", "label": "India" }
      ]
    },
    {
      "id": "comments",
      "type": "textarea",
      "label": "Comments",
      "placeholder": "Enter your comments"
    }
  ]
}
```

This JSON will generate a form with the following fields:

- A text input for the full name (with validation for alphabetic characters).
- An email input with email validation.
- Radio buttons for gender selection.
- A select dropdown for country selection.
- A textarea for additional comments.