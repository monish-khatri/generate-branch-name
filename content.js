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
    dialog.innerHTML = `<p>Branch Name Copied to Clipboard:</p><p style="font-weight: bold">${message}</p>`;

    // Customize the styles as needed
    dialog.style.cssText = "position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #fff;padding: 20px;border: 1px solid #ccc;z-index: 999;";

    document.body.appendChild(dialog);

    setTimeout(() => {
      document.body.removeChild(dialog);
    }, 3000);  // Remove the dialog after 3 seconds (adjust as needed)
}

function createBranchName(taskTitle){
    return  taskTitle.replace(/[{}\[\]()\/\\:;@#$%^&*!'"`]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}