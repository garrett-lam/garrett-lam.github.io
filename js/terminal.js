document.addEventListener('DOMContentLoaded', () => {
    const contentSection = document.getElementById('content-section');
    const typedText = document.getElementById('typed-text');
    const cursor = document.getElementById('cursor');
    const navButtons = document.querySelectorAll('.nav-button');

    // Content for each section
    const content = {
        home: {
            title: "Home",
            content: `<div class="section-content">
                <h1>Welcome to my Portfolio</h1>
                <p>Hello! I'm Garrett Lam, a [your title/role] based in [your location]. This is my terminal-themed portfolio website.</p>
                <p>Use the navigation buttons above to explore different sections, or enjoy the terminal experience by watching the simulated commands below.</p>
                <p>Feel free to check out my projects and get in touch if you'd like to collaborate!</p>
            </div>`
        },
        about: {
            title: "About Me",
            content: `<div class="section-content">
                <h1>About Me</h1>
                <p>I'm Garrett Lam, passionate about [your interests]. I specialize in [your specialties].</p>
                
                <h2>Skills</h2>
                <ul>
                    <li>Skill 1</li>
                    <li>Skill 2</li>
                    <li>Skill 3</li>
                    <li>Skill 4</li>
                </ul>
                
                <h2>Interests</h2>
                <ul>
                    <li>Interest 1</li>
                    <li>Interest 2</li>
                    <li>Interest 3</li>
                </ul>
            </div>`
        },
        education: {
            title: "Education",
            content: `<div class="section-content">
                <h1>Education</h1>
                
                <h2>University Name</h2>
                <h3>Degree Name</h3>
                <p>Year - Year</p>
                <ul>
                    <li>Notable achievement or coursework</li>
                    <li>GPA or honors</li>
                    <li>Relevant projects</li>
                </ul>
                
                <h2>Previous Education</h2>
                <h3>School/Program</h3>
                <p>Year - Year</p>
                <ul>
                    <li>Achievement</li>
                    <li>Relevant coursework</li>
                </ul>
                
                <h2>Certifications</h2>
                <ul>
                    <li>Certification 1 - Issuing Organization (Year)</li>
                    <li>Certification 2 - Issuing Organization (Year)</li>
                </ul>
            </div>`
        },
        experience: {
            title: "Experience",
            content: `<div class="section-content">
                <h1>Work Experience</h1>
                
                <h2>Company Name</h2>
                <h3>Position Title</h3>
                <p>Month Year - Present</p>
                <ul>
                    <li>Accomplishment or responsibility</li>
                    <li>Accomplishment or responsibility</li>
                    <li>Accomplishment or responsibility</li>
                </ul>
                
                <h2>Previous Company</h2>
                <h3>Position Title</h3>
                <p>Month Year - Month Year</p>
                <ul>
                    <li>Accomplishment or responsibility</li>
                    <li>Accomplishment or responsibility</li>
                </ul>
            </div>`
        },
        projects: {
            title: "Projects",
            content: `<div class="section-content">
                <h1>Projects</h1>
                
                <h2>Project Name</h2>
                <p>Technologies: Technology 1, Technology 2, Technology 3</p>
                <ul>
                    <li>Description of the project and your role</li>
                    <li>Key features implemented</li>
                    <li>Challenges overcome</li>
                    <li><a href="#" target="_blank">GitHub Repo</a> | <a href="#" target="_blank">Live Demo</a></li>
                </ul>
                
                <h2>Another Project</h2>
                <p>Technologies: Technology 1, Technology 2</p>
                <ul>
                    <li>Description of the project and your role</li>
                    <li>Key features implemented</li>
                    <li>Challenges overcome</li>
                    <li><a href="#" target="_blank">GitHub Repo</a> | <a href="#" target="_blank">Live Demo</a></li>
                </ul>
            </div>`
        }
    };

    let currentSection = 'home';
    let commandQueue = [
        { command: 'ls', delay: 1000 },
        { command: 'cat about.md', delay: 2000 },
        { command: 'cd experience', delay: 2000 },
        { command: 'ls -la', delay: 1500 }
    ];
    let isTyping = false;
    
    // Initialize with home content
    updateContent('home');
    setActiveNavButton('home');
    
    // Start typing animation for terminal effect
    startTerminalAnimation();

    // Event listeners for navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.getAttribute('data-section');
            updateContent(section);
            setActiveNavButton(section);
        });
    });

    function updateContent(section) {
        currentSection = section;
        if (content[section]) {
            contentSection.innerHTML = content[section].content;
            // Add typing effect to simulate changing directories
            queueCommand(`cd ${section}`);
        }
    }

    function setActiveNavButton(section) {
        navButtons.forEach(button => {
            if (button.getAttribute('data-section') === section) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    function queueCommand(command) {
        commandQueue.push({ command, delay: 1500 });
        if (!isTyping) {
            typeNextCommand();
        }
    }

    function startTerminalAnimation() {
        if (!isTyping) {
            typeNextCommand();
        }
    }

    function typeNextCommand() {
        if (commandQueue.length === 0) {
            // Add more commands to keep the terminal "alive"
            setTimeout(() => {
                commandQueue = [
                    { command: 'ls -la', delay: 2000 },
                    { command: `cd ${['home', 'about', 'education', 'experience', 'projects'][Math.floor(Math.random() * 5)]}`, delay: 2000 },
                    { command: 'echo "Feel free to check out my projects!"', delay: 2500 }
                ];
                typeNextCommand();
            }, 10000);
            return;
        }

        const nextCommand = commandQueue.shift();
        isTyping = true;
        typedText.textContent = '';

        let i = 0;
        const typeChar = () => {
            if (i < nextCommand.command.length) {
                typedText.textContent += nextCommand.command.charAt(i);
                i++;
                setTimeout(typeChar, Math.random() * 100 + 50);
            } else {
                isTyping = false;
                setTimeout(() => {
                    typedText.textContent = '';
                    if (commandQueue.length > 0) {
                        typeNextCommand();
                    }
                }, nextCommand.delay);
            }
        };

        typeChar();
    }
});