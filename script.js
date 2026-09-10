// ==============================
// MOBILE MENU
// ==============================

function toggleMenu() {

    const mobileMenu =
        document.getElementById("mobileMenu");

    mobileMenu.classList.toggle("active");

    document.body.classList.toggle(
        "menu-open",
        mobileMenu.classList.contains("active")
    );

}


function closeMenu() {

    const mobileMenu =
        document.getElementById("mobileMenu");

    mobileMenu.classList.remove("active");

    document.body.classList.remove(
        "menu-open"
    );

}


// 메뉴 열렸을 때 스크롤 방지
const observer =
    new MutationObserver(() => {

        if (
            document.body.classList.contains(
                "menu-open"
            )
        ) {
            document.body.style.overflow =
                "hidden";
        } else {
            document.body.style.overflow =
                "";
        }

    });

observer.observe(
    document.body,
    {
        attributes: true,
        attributeFilter: ["class"]
    }
);


// ==============================
// SCROLL REVEAL
// ==============================

const revealElements =
    document.querySelectorAll(
        ".project, .next-project, .service-item, .process-item"
    );


revealElements.forEach((element) => {

    element.classList.add("reveal");

});


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "show"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});