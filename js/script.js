/* =========================================================
   PORTFOLIO WEBSITE JAVASCRIPT
   ========================================================= */


/* =========================================================
   BASIC ELEMENTS
   ========================================================= */

const root = document.documentElement;

const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const progress = document.getElementById("scrollProgress");


/* =========================================================
   THEME TOGGLE
   ========================================================= */

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme) {

    root.setAttribute("data-theme", savedTheme);

} else {

    root.setAttribute(
        "data-theme",
        window.matchMedia("(prefers-color-scheme: light)").matches
            ? "light"
            : "dark"
    );

}


if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        const current =
            root.getAttribute("data-theme");

        const next =
            current === "light"
                ? "dark"
                : "light";

        root.setAttribute(
            "data-theme",
            next
        );

        localStorage.setItem(
            "portfolio-theme",
            next
        );

    });

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("open");

        menuToggle.textContent =
            navLinks.classList.contains("open")
                ? "✕"
                : "☰";

    });

}


/* =========================================================
   CLOSE MOBILE MENU WHEN NAV LINK IS CLICKED
   ========================================================= */

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            if (navLinks) {
                navLinks.classList.remove("open");
            }

            if (menuToggle) {
                menuToggle.textContent = "☰";
            }

        });

    });


/* =========================================================
   SCROLL PROGRESS + ACTIVE NAVIGATION
   ========================================================= */

const sections =
    [...document.querySelectorAll("main section[id]")];

const navItems =
    [...document.querySelectorAll(".nav-links a")];


function updateScrollUI() {

    const scrollTop =
        window.scrollY;

    const height =
        document.documentElement.scrollHeight -
        window.innerHeight;


    /* Scroll progress */

    if (progress) {

        progress.style.width =
            `${height > 0
                ? (scrollTop / height) * 100
                : 0}%`;

    }


    /* Active navigation item */

    let current = "home";


    sections.forEach(section => {

        if (
            scrollTop >=
            section.offsetTop - 180
        ) {

            current = section.id;

        }

    });


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.getAttribute("href") ===
            `#${current}`
        );

    });

}


window.addEventListener(
    "scroll",
    updateScrollUI,
    { passive: true }
);

updateScrollUI();


/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


document
    .querySelectorAll(".reveal")
    .forEach(element => {

        observer.observe(element);

    });


/* =========================================================
   CURRENT YEAR
   ========================================================= */

const yearElement =
    document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

const form =
    document.getElementById("contactForm");

const formStatus =
    document.getElementById("formStatus");


/*
   IMPORTANT:
   Keep this as a normal URL.
   Do NOT use Markdown [URL](URL) syntax here.
*/

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxnXljxFCHmQrILjPatAaK6SWXimT6wSGJutlUFzTC-hqKNk0goaudJYIPbboZjnr40/exec";


if (form) {

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* Submit button */

            const submitButton =
                form.querySelector(
                    "button[type='submit']"
                );


            const originalText =
                submitButton
                    ? submitButton.innerHTML
                    : "";


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    "Sending...";

            }


            if (formStatus) {

                formStatus.textContent = "";

            }


            /* Get form data */

            const formData =
                new FormData(form);


            const data = {

                name:
                    formData.get("name"),

                email:
                    formData.get("email"),

                subject:
                    formData.get("subject"),

                message:
                    formData.get("message")

            };


            try {

                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {
                        method: "POST",

                        mode: "no-cors",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


                if (formStatus) {

                    formStatus.textContent =
                        "Message sent successfully!";

                    formStatus.style.color =
                        "#63d49a";

                }


                form.reset();


            } catch (error) {

                console.error(
                    "Error:",
                    error
                );


                if (formStatus) {

                    formStatus.textContent =
                        "Something went wrong. Please try again.";

                    formStatus.style.color =
                        "#ff6b6b";

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        originalText;

                }

            }

        }
    );

}


/* =========================================================
   PROJECT CASE STUDY MODAL
   ========================================================= */


/* ---------------------------------------------------------
   GET MODAL ELEMENTS
   --------------------------------------------------------- */

const caseStudyModal =
    document.getElementById(
        "caseStudyModal"
    );

const caseStudyClose =
    document.getElementById(
        "caseStudyClose"
    );

const caseStudyOverlay =
    document.getElementById(
        "caseStudyOverlay"
    );

const modalProjectNumber =
    document.getElementById(
        "modalProjectNumber"
    );

const modalProjectType =
    document.getElementById(
        "modalProjectType"
    );

const modalProjectTitle =
    document.getElementById(
        "modalProjectTitle"
    );

const modalProjectTags =
    document.getElementById(
        "modalProjectTags"
    );

const modalProjectContent =
    document.getElementById(
        "modalProjectContent"
    );

const modalGithubLink =
    document.getElementById(
        "modalGithubLink"
    );


/* ---------------------------------------------------------
   PROJECT DATA
   --------------------------------------------------------- */

const projectDataElement =
    document.getElementById(
        "projectData"
    );


let projects = [];


if (projectDataElement) {

    try {

        projects =
            JSON.parse(
                projectDataElement.textContent
            );

    } catch (error) {

        console.error(
            "Unable to parse project data:",
            error
        );

    }

}


/* ---------------------------------------------------------
   FIND PROJECT
   --------------------------------------------------------- */

function getProject(projectId) {

    return projects.find(
        project =>
            String(project.id) ===
            String(projectId)
    );

}


/* ---------------------------------------------------------
   CREATE ARCHITECTURE HTML
   --------------------------------------------------------- */

function createArchitectureHTML(points) {

    if (
        !points ||
        !points.length
    ) {

        return "";

    }


    return `

        <div class="architecture-list">

            ${points.map(point => {

                const parts =
                    point.split(" for ");

                let title =
                    parts[0];

                let description =
                    "";


                if (parts.length > 1) {

                    description =
                        "for " +
                        parts
                            .slice(1)
                            .join(" for ");

                }


                return `

                    <div class="architecture-item">

                        <strong>
                            ${title}
                        </strong>

                        <span>
                            ${description}
                        </span>

                    </div>

                `;

            }).join("")}

        </div>

    `;

}


/* ---------------------------------------------------------
   CREATE CHALLENGES HTML
   --------------------------------------------------------- */

function createChallengesHTML(
    challenges
) {

    if (
        !challenges ||
        !challenges.length
    ) {

        return "";

    }


    return challenges
        .map(
            (challenge, index) => {

                return `

                    <div class="challenge-item">

                        <strong>
                            ${String(
                                index + 1
                            ).padStart(
                                2,
                                "0"
                            )}

                            —
                            ${challenge.title}
                        </strong>

                        <p>

                            <strong>
                                Solution:
                            </strong>

                            ${challenge.solution}

                        </p>

                    </div>

                `;

            }
        )
        .join("");

}


/* ---------------------------------------------------------
   CREATE TECHNOLOGY HTML
   --------------------------------------------------------- */

function createTechnologyHTML(
    technologies
) {

    if (
        !technologies ||
        !technologies.length
    ) {

        return "";

    }


    return `

        <div class="modal-tech-tags">

            ${technologies
                .map(
                    technology => `

                        <span>
                            ${technology}
                        </span>

                    `
                )
                .join("")}

        </div>

    `;

}


/* ---------------------------------------------------------
   CREATE MODAL CONTENT
   --------------------------------------------------------- */

function createModalContent(
    project
) {

    const content =
        project.content;


    return `

        <!-- OVERVIEW -->

        <h3>
            Project Overview
        </h3>

        <p>
            ${content.overview}
        </p>


        <!-- ARCHITECTURE -->

        <h3>
            Architecture
        </h3>

        <p>
            ${content.architecture}
        </p>

        ${createArchitectureHTML(
            content.architecturePoints
        )}


        <!-- IMPLEMENTATION -->

        <h3>
            Implementation
        </h3>

        <p>
            ${content.implementation}
        </p>


        <!-- CHALLENGES -->

        <h3>
            Challenges & Solutions
        </h3>

        ${createChallengesHTML(
            content.challenges
        )}


        <!-- TECHNOLOGIES -->

        <h3>
            Technologies
        </h3>

        ${createTechnologyHTML(
            content.technologies
        )}


        <!-- RESULT -->

        <h3>
            Result
        </h3>

        <p>
            ${content.result}
        </p>

    `;

}


/* =========================================================
   OPEN CASE STUDY MODAL
   ========================================================= */

function openCaseStudy(
    projectId
) {

    const project =
        getProject(projectId);


    if (!project) {

        console.error(
            "Project not found:",
            projectId
        );

        return;

    }


    /* Project number */

    if (modalProjectNumber) {

        modalProjectNumber.textContent =
            project.number;

    }


    /* Project type */

    if (modalProjectType) {

        modalProjectType.textContent =
            project.type;

    }


    /* Project title */

    if (modalProjectTitle) {

        modalProjectTitle.textContent =
            project.title;

    }


    /* Project tags */

    if (modalProjectTags) {

        modalProjectTags.innerHTML =
            project.tags
                .map(
                    tag =>
                        `<span>${tag}</span>`
                )
                .join("");

    }


    /* Project content */

    if (modalProjectContent) {

        modalProjectContent.innerHTML =
            createModalContent(
                project
            );

    }


    /* GitHub repository */

    if (modalGithubLink) {

        modalGithubLink.href =
            project.github || "#";

    }


    /* Open modal */

    if (caseStudyModal) {

        caseStudyModal.classList.add(
            "active"
        );

        caseStudyModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* Lock page scrolling */

    document.body.classList.add(
        "modal-open"
    );


    /* Scroll modal content to top */

    if (modalProjectContent) {

        modalProjectContent.scrollTop = 0;

    }

}


/* =========================================================
   CLOSE CASE STUDY MODAL
   ========================================================= */

function closeCaseStudy() {

    if (caseStudyModal) {

        caseStudyModal.classList.remove(
            "active"
        );

        caseStudyModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   CASE STUDY BUTTONS
   ========================================================= */

/*
   IMPORTANT:
   There is NO old "case-study-open" toggle here.

   Clicking Case Study ONLY opens the modal.
*/

document
    .querySelectorAll(".case-study-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const projectId =
                    button.dataset.project;


                if (!projectId) {

                    console.error(
                        "Missing data-project on Case Study button."
                    );

                    return;

                }


                openCaseStudy(
                    projectId
                );

            }
        );

    });


/* =========================================================
   CLOSE BUTTON
   ========================================================= */

if (caseStudyClose) {

    caseStudyClose.addEventListener(
        "click",
        closeCaseStudy
    );

}


/* =========================================================
   CLICK BACKDROP TO CLOSE
   ========================================================= */

if (caseStudyOverlay) {

    caseStudyOverlay.addEventListener(
        "click",
        closeCaseStudy
    );

}


/* =========================================================
   ESC KEY TO CLOSE
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            caseStudyModal &&
            caseStudyModal.classList.contains(
                "active"
            )
        ) {

            closeCaseStudy();

        }

    }
);


/* =========================================================
   PREVENT EMPTY GITHUB LINK
   ========================================================= */

if (modalGithubLink) {

    modalGithubLink.addEventListener(
        "click",
        event => {

            const href =
                modalGithubLink.getAttribute(
                    "href"
                );


            if (
                !href ||
                href === "#"
            ) {

                event.preventDefault();

                alert(
                    "Add the GitHub repository URL for this project."
                );

            }

        }
    );

}


/* =========================================================
   PREVENT MODAL CONTENT CLICK FROM CLOSING MODAL
   ========================================================= */

const caseStudyDialog =
    document.getElementById(
        "caseStudyDialog"
    );


if (caseStudyDialog) {

    caseStudyDialog.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );

}


/* =========================================================
   END OF SCRIPT
   ========================================================= */
