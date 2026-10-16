Opened from every Share button.
```jsx
<ShareSheet place="v626704" onClose={close} onCopied={() => toast("Link copied")} onSave={f => saveCard(f)} />
```
- On phones "Send" calls navigator.share. On desktop, Share copies straight away and shows the Toast; the sheet is optional.
- No share counts, like counts or social logins, ever.
