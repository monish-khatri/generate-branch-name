chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'generateBranchName') {
        const pageTitle = document.title;
        if (pageTitle) {
            var branchName = pageTitle.replace('- Jira', '').replace(/[{}\[\]()\/\\:;@#$%^&*!'"`]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/-+/g, '-');
            copyToClipboard(branchName);
            showFormattedDialog('Branch Name Copied', '<b>' + branchName + '</b>');
        } else {
            alert('No title find');
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

function showFormattedDialog(title, message) {
    const dialog = document.createElement('div');
    dialog.innerHTML = `<p style="font-weight: bold">${title}</p><p>${message}</p>`;

    // Customize the styles as needed
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = '#fff';
    dialog.style.padding = '20px';
    dialog.style.border = '1px solid #ccc';

    document.body.appendChild(dialog);

    setTimeout(() => {
      document.body.removeChild(dialog);
    }, 3000);  // Remove the dialog after 3 seconds (adjust as needed)
  }