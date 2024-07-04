const profilePhoto = document.querySelector(".profile-photo")

profilePhoto.addEventListener("click", () => {
    // if (document.body.className == 'dark-mode') {
    //     document.body.className = ''
    // } else {
    //     document.body.className = 'dark-mode'
    // }

    document.body.classList.toggle("dark-mode")
})

fetch("https://m.search.naver.com/p/csearch/content/apirender.nhn?where=nexearch&pkid=387&u2=20000413&q=%EC%83%9D%EB%85%84%EC%9B%94%EC%9D%BC+%EC%9A%B4%EC%84%B8&u1=m&u3=solar&u4=12&_=1719518803829")
    .then(response => response.json()) // 응답을 JSON으로 파싱
    .then(data => {
        const htmlString = data.flick[0]; // 첫 번째 항목 선택
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const fortune = doc.querySelector('dd b').textContent;
        const fortuneText = doc.querySelector('dd p').textContent;
        console.log(fortune); // 추출한 텍스트 출력
        console.log(fortuneText); // 추출한 텍스트 출력

        const fortuneE = document.createElement("h3")
        fortuneE.style.margin = 0
        fortuneE.textContent = fortune
        const fortuneTextE = document.createElement("p")
        fortuneTextE.textContent = fortuneText
        const fortuneSection = document.createElement("section")
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = '오늘의 운세';
        // append : 자식중 가장 마지막에 삽입
        fortuneSection.append(sectionTitle);
        fortuneSection.append(fortuneE)
        fortuneSection.append(fortuneTextE)

        // after, before는 앞뒤 즉 형제가 되는겁니다.
        const contactSection = document.querySelector(".contact");
        contactSection.before(fortuneSection);

        const sections = document.querySelectorAll('.right section');

        let currentIndex = 0;

        const showAfterSection = () => {
            sections.forEach((section) => {
                section.style.display = 'none';
            });

            if (currentIndex == sections.length - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            sections[currentIndex].style.display = 'flex';
        }

        const showBeforeSection = () => {
            sections.forEach((section) => {
                section.style.display = 'none';
            });

            if (currentIndex == 0) {
                currentIndex = (sections.length - 1);
            } else {
                currentIndex--;
            }
            sections[currentIndex].style.display = 'flex';
        }

        let intervalId = setInterval(() => {
            // sections[currentIndex].style.display = 'none';
            // if (currentIndex == (sections.length - 1)) {
            //     currentIndex = 0;
            // } else {
            //     currentIndex++;
            // }
            // sections[currentIndex].style.display = 'flex';

            showAfterSection();
        }, 3000);

        const resetInterval = () => {
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                showAfterSection();
            }, 3000);
        }

        sections.forEach((section) => {
            section.addEventListener('click', (event) => {
                const sectionWidth = section.offsetWidth;

                const clickX = event.clientX - section.getBoundingClientRect().left;

                if (clickX < sectionWidth / 3) {
                    // if (index != 0) {
                    //     section.style.display = 'none'
                    //     sections[index - 1].style.display = 'flex'
                    //     currentIndex = index -1;
                    // }

                    showBeforeSection();
                    resetInterval();
                } else if (clickX > sectionWidth * 2 / 3) {
                    // if (index != (sections.length - 1)) {
                    //     section.style.display = 'none'
                    //     sections[index + 1].style.display = 'flex'
                    //     currentIndex = index + 1;
                    // }
                    showAfterSection();
                    resetInterval();
                } else {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    } else {
                        intervalId = setInterval(showAfterSection, 3000);
                    }
                }
            })

            const iconContainer = document.querySelector(".icon-container");
            section.addEventListener('mousemove', function (event) {
                const sectionWidth = section.offsetWidth;
                const clickX = event.clientX - section.getBoundingClientRect().left;

                // 아이콘 표시 위치 설정
                iconContainer.style.top = `${event.clientY - 20}px`;
                iconContainer.style.left = `${event.clientX - 20}px`;

                // 마우스 위치에 따라 클래스명 변경
                if (clickX < sectionWidth / 3) {
                    iconContainer.innerHTML = '<i class="fa-solid fa-backward-fast"></i>';
                } else if (clickX > sectionWidth * 2 / 3) {
                    iconContainer.innerHTML = '<i class="fa-solid fa-forward-fast"></i>';
                } else {
                    if (intervalId) {
                        iconContainer.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    } else {
                        iconContainer.innerHTML = '<i class="fa-solid fa-play"></i>'
                    }
                    // 삼항연산자
                    //iconContainer.innerHTML = intervalId ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
                }
            });

            section.addEventListener('mouseleave', function () {
                // 마우스가 섹션을 떠날 때 아이콘 숨김
                iconContainer.innerHTML = '';
            });
        })
    })