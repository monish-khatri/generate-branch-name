chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'generateBranchName') {
        var pageTitle = document.title;
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const taskId = params.get('selectedIssue');

        var branchName = '';
        if (taskId) {
            const substringToFind = "edit summary";
            const button = document.querySelector(`button[aria-label*="${substringToFind}"]`);
            pageTitle = `${taskId} ${button.getAttribute('aria-label')}`;
            branchName = createBranchName(pageTitle.replace("- " + substringToFind, ''))
        } else if(pageTitle) {
            branchName = createBranchName(pageTitle.replace('- Jira', ''))
        }

        if(branchName) {
            copyToClipboard(branchName);
            showFormattedDialog(branchName);
        }
    }
});

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showFormattedDialog(message) {
    const dialog = document.createElement('div');
    const isDarkMode = checkDarkMode();

    var backgroundColor = '#000';
    var textColor = '#fff';

    console.log("DARKMODE" + isDarkMode)
    if (isDarkMode) {
        backgroundColor = '#fff';
        textColor = '#000';
    }
    dialog.innerHTML = `<p>Branch Name Copied to Clipboard:</p><p style="font-weight: bold">${message}</p>`;

    dialog.style.cssText = `position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: ${backgroundColor};color:${textColor}; padding: 20px;border: 1px solid #ccc;z-index: 999;`;

    document.body.appendChild(dialog);

    setTimeout(() => {
      document.body.removeChild(dialog);
    }, 3000);
}

function createBranchName(taskTitle){
    return  taskTitle.replace(/[{}\[\]()\/\\:;@#$%^&*!'"`]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

function isDarkColor(color) {
    const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
    return luminance < 0.5; // Adjust this threshold as needed
}

function getBodyBackgroundColor() {
    return window.getComputedStyle(document.body).backgroundColor;
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function checkDarkMode() {
    const backgroundColor = hexToRgb(getBodyBackgroundColor());
    const isDark = isDarkColor(backgroundColor);
    return isDark;
}