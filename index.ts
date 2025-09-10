let lastSubreddit: string | null = null;

function initSubscriberCount() {
    const url = document.location.href;
    const subredditMatch = url.match(/reddit\.com\/r\/([^/]+)/);
    const subredditName = subredditMatch ? subredditMatch[1] : null;

    if (!subredditName || subredditName === lastSubreddit) return;
    lastSubreddit = subredditName;

    function waitForElement(selector: string, callback: (el: Element) => void) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    fetch(`https://www.reddit.com/r/${subredditName}/about.json`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok.");
            }
            return res.json();
        })
        .then((data) => {
            const subscribers = data.data?.subscribers;
            if (!subscribers) return;

            waitForElement("shreddit-subreddit-header", (header) => {
                const shadowRoot = (header as HTMLElement).shadowRoot;
                if (!shadowRoot) return;

                const activityContainer = shadowRoot.querySelector(
                    'div[data-testid="activity-indicators"]'
                ) as HTMLElement | null;
                if (!activityContainer) return;

                const firstChild = activityContainer.querySelector("div.flex.flex-col") as HTMLElement;
                if (!firstChild) return;

                // Remove previous clone if exists
                const oldClone = shadowRoot.querySelector(".custom-subreddit-indicator");
                if (oldClone) oldClone.remove();

                const clone = firstChild.cloneNode(true) as HTMLElement;
                clone.classList.add("custom-subreddit-indicator");

                const strongSpan = clone.querySelector("strong");
                if (strongSpan) strongSpan.textContent = subscribers.toLocaleString();

                const weakSpan = clone.querySelector("span.text-\\[12px\\]");
                if (weakSpan) weakSpan.textContent = "Subscribers";

                activityContainer.appendChild(clone);
            });
        });
}

initSubscriberCount();

let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        initSubscriberCount();
    }
});
urlObserver.observe(document, { subtree: true, childList: true });
