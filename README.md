﻿# Modern To-Do List App

A beautiful, feature-rich, and secure to-do list web application built with HTML, CSS, and JavaScript.

## Features

- ✅ **Intuitive Task Management**: Create, edit, and delete tasks with a clean and modern interface
- 🔄 **Task Status Tracking**: Mark tasks as complete or active with a simple click
- 🔍 **Priority-Based Filtering**: Filter tasks by priority (high, medium, low)
- 📊 **Automatic Sorting**: Sort tasks by priority and due date
- 🎯 **Priority Levels**: Assign low, medium, or high priority to each task
- 📅 **Date Scheduling**: Set due dates for your tasks
- 🔒 **Secure Input Handling**: Protection against XSS attacks
- 💾 **Local Storage**: Tasks are saved in your browser's local storage
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔔 **Notification System**: Get feedback on your actions with elegant notifications
- 🌙 **Modern UI**: Beautiful gradient colors and smooth animations
- ♿ **Accessibility**: Built with accessibility in mind using ARIA attributes

## Usage Instructions

1. **Adding a Task**:
   - Enter task description in the input field
   - Select a due date
   - Choose priority level (Low, Medium, High)
   - Click "Add Task" button

2. **Completing a Task**:
   - Click on any task to mark it as complete/incomplete

3. **Editing a Task**:
   - Click the edit (pencil) icon on any task
   - Update details in the modal window
   - Click "Save Changes"

4. **Deleting a Task**:
   - Click the delete (trash) icon on the task you want to remove
   - Confirm deletion in the dialog

5. **Filtering Tasks**:
   - Use the filter buttons to view tasks by priority
   - "All" button shows all tasks

6. **Sorting Tasks**:
   - Click "Sort by Priority" button to sort tasks

7. **Clearing All Tasks**:
   - Click "Clear All" button and confirm to remove all tasks

## Technical Details

### Technologies Used

- **HTML5**: For structure and semantic markup
- **CSS3**: For styling and animations
- **JavaScript (ES6+)**: For interactivity and logic
- **Local Storage API**: For persisting data in the browser
- **Font Awesome**: For icons
- **Google Fonts**: For typography

### Security Measures

The application implements several security measures:

- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Input Validation**: Validates all inputs before processing
- **Error Handling**: Comprehensive error handling and user feedback

### Code Structure

- **index.html**: Main HTML structure
- **styles.css**: All styling and animations
- **script.js**: Application logic and functionality

## Installation

No installation required! This is a client-side application that runs in any modern web browser.

1. **Clone or download the repository**:
   ```
   git clone https://github.com/annisacode/todolist.git
   ```

2. **Open the index.html file** in your web browser

3. **Start managing your tasks!**

Alternatively, you can use a local development server:

```
# Using Python
python -m http.server

# Using Node.js
npx serve
```

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Future Enhancements

- Cloud synchronization
- User accounts
- Task categories and tags
- Recurring tasks
- Dark mode
- Collaboration features
- Mobile app version

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by Annisa
