document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const input = document.getElementById('input');
    const terminal = document.querySelector('.terminal-content');

    // Content for each section
    const content = {
        home: {
            title: "Home Directory",
            content: `Welcome to my personal website terminal.
            
Type 'ls' to see available directories.
Type 'cd [directory]' to navigate to a directory.
Type 'help' for more commands.`
        },
        about: {
            title: "About Me",
            content: `# About Me

I'm Garrett Lam, a [your title/role] based in [your location].

## Skills
- Skill 1
- Skill 2
- Skill 3

## Education
- Degree, University, Year
- Certification, Institution, Year

## Interests
- Interest 1
- Interest 2
- Interest 3`
        },
        experience: {
            title: "Work Experience",
            content: `# Work Experience

## [Company Name] - [Position]
*[Date Range]*
- Accomplishment 1
- Accomplishment 2
- Accomplishment 3

## [Previous Company] - [Position]
*[Date Range]*
- Accomplishment 1
- Accomplishment 2
- Accomplishment 3`
        },
        projects: {
            title: "Projects",
            content: `# Projects

## [Project Name]
*[Technologies Used]*
- Description of the project
- Key features implemented
- Link: [GitHub Repo](#)

## [Another Project]
*[Technologies Used]*
- Description of the project
- Key features implemented
- Link: [Live Demo](#)`
        },
        contact: {
            title: "Contact",
            content: `# Contact Information

- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](#)
- GitHub: [Your GitHub](#)
- Twitter: [Your Twitter](#)

Feel free to reach out to me through any of these channels!`
        }
    };

    let currentDirectory = 'home';
    let history = [];
    let historyIndex = -1;
    let directories = ['home', 'about', 'experience', 'projects', 'contact'];

    // Initial welcome message
    printOutput(`Type 'help' to see available commands.`, 'info');

    // Event listeners
    input.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', () => input.focus());

    // Focus input on load
    input.focus();

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = input.textContent.trim();
            if (command) {
                executeCommand(command);
                history.unshift(command);
                historyIndex = -1;
                input.textContent = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0 && historyIndex < history.length - 1) {
                historyIndex++;
                input.textContent = history[historyIndex];
                // Move cursor to end
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(input);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > -1) {
                historyIndex--;
                input.textContent = historyIndex >= 0 ? history[historyIndex] : '';
                // Move cursor to end
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(input);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            tabComplete();
        }
    }

    function tabComplete() {
        const text = input.textContent.trim();
        if (text.startsWith('cd ')) {
            const partial = text.substring(3).toLowerCase();
            const matches = directories.filter(d => d.startsWith(partial) && d !== partial);
            if (matches.length === 1) {
                input.textContent = 'cd ' + matches[0];
            }
        }
    }

    function executeCommand(command) {
        printOutput(`<span class="prompt">visitor@garrettlam:~${currentDirectory === 'home' ? '' : '/' + currentDirectory}$</span> ${command}`);
        
        const cmd = command.toLowerCase().trim();
        const args = cmd.split(' ');

        switch (args[0]) {
            case 'ls':
                listDirectories();
                break;
            case 'cd':
                changeDirectory(args[1]);
                break;
            case 'cat':
                if (args[1]) {
                    displayContent(args[1]);
                } else {
                    printOutput('Usage: cat [file]', 'error');
                }
                break;
            case 'pwd':
                printOutput(`/home/visitor/${currentDirectory === 'home' ? '' : currentDirectory}`, 'success');
                break;
            case 'clear':
                clearScreen();
                break;
            case 'echo':
                printOutput(command.substring(5), 'info');
                break;
            case 'help':
                showHelp();
                break;
            case 'about':
                changeDirectory('about');
                break;
            case 'experience':
                changeDirectory('experience');
                break;
            case 'projects':
                changeDirectory('projects');
                break;
            case 'contact':
                changeDirectory('contact');
                break;
            case 'home':
                changeDirectory('home');
                break;
            default:
                printOutput(`Command not found: ${command}. Type 'help' to see available commands.`, 'error');
        }

        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }

    function listDirectories() {
        let result = '';
        directories.forEach(dir => {
            result += `<span class="menu-item" onclick="document.getElementById('input').textContent='cd ${dir}'; document.getElementById('input').dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));">${dir}/</span>  `;
        });
        printOutput(result);
    }

    function changeDirectory(dir) {
        if (!dir) {
            printOutput('Usage: cd [directory]', 'error');
            return;
        }

        if (dir === '..') {
            currentDirectory = 'home';
            printOutput(`Changed to directory: ${currentDirectory}/`, 'success');
            return;
        }

        const targetDir = dir.toLowerCase();
        if (directories.includes(targetDir)) {
            currentDirectory = targetDir;
            printOutput(`Changed to directory: ${currentDirectory}/`, 'success');
            displayContent(currentDirectory);
        } else {
            printOutput(`Directory not found: ${dir}`, 'error');
        }
    }

    function displayContent(section) {
        if (content[section]) {
            const contentText = content[section].content;
            const formatted = formatMarkdown(contentText);
            printOutput(`<h2>${content[section].title}</h2>${formatted}`);
        } else {
            printOutput(`No content available for: ${section}`, 'error');
        }
    }

    function formatMarkdown(text) {
        // Basic markdown parsing
        let formattedText = text
            .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
            .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
            .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="link" target="_blank">$1</a>')
            .replace(/- (.*?)$/gm, '• $1<br>')
            .replace(/\n/g, '<br>');
        
        return formattedText;
    }

    function clearScreen() {
        output.innerHTML = '';
    }

    function showHelp() {
        const helpText = `
<span class="info">Available commands:</span>

<span class="success">ls</span> - List directories
<span class="success">cd [directory]</span> - Change to directory
<span class="success">cd ..</span> - Go back to home
<span class="success">pwd</span> - Print working directory
<span class="success">cat [section]</span> - Display content of a section
<span class="success">clear</span> - Clear the screen
<span class="success">help</span> - Show this help

<span class="info">Shortcuts:</span>
<span class="success">about</span> - Go to About section
<span class="success">experience</span> - Go to Experience section
<span class="success">projects</span> - Go to Projects section
<span class="success">contact</span> - Go to Contact section
<span class="success">home</span> - Go to Home section
`;
        printOutput(helpText);
    }

    function printOutput(text, className = '') {
        const outputElement = document.createElement('div');
        outputElement.classList.add('output-line');
        if (className) {
            outputElement.classList.add(className);
        }
        outputElement.innerHTML = text;
        output.appendChild(outputElement);
        terminal.scrollTop = terminal.scrollHeight;
    }
});