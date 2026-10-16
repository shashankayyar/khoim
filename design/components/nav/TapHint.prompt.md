"Tap any taluka". Sits above the bottom sheet on the first visit only.
```jsx
<TapHint visible={!tapped} />
```
- Demo sequence (caller): 600ms after paint-in, set the map's hot to one taluka and show its name in the sheet for 2400ms (--dur-demo), then clear and show the hint. Reduced motion: keep the taluka lit and the hint showing, no movement, until the first tap.
