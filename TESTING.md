# API Testing Guide

## Available Test Methods

You now have several ways to test and explore API data:

### 1. **Basic API Connectivity Test**
```bash
npm run test-api
```
- Tests network connectivity
- Shows basic API response structure
- Works without authentication

### 2. **Comprehensive Data Structure Test**
```bash
npm run test-data
```
- Shows mock data structure
- Demonstrates how API data is processed
- Shows what Discord events would look like
- Tests real API if token is provided

### 3. **Bot with Test Mode**
```bash
npm run test
```
- Starts bot in test mode
- Runs API test once and exits
- Requires Discord token

## Setting Up API Authentication

1. **Create `.env` file** (copy from `.env.sample`):
   ```bash
   cp .env.sample .env
   ```

2. **Add your tokens**:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   START_GG_TOKEN=your_start_gg_api_token
   ```

3. **Get Start.gg API Token**:
   - Go to https://start.gg/admin/profile/developer
   - Create a new API token
   - Add it to your `.env` file

## Test Results Explanation

### Mock Data Structure
The test shows you exactly what data structure to expect from start.gg API:

```javascript
{
  data: {
    tournaments: {
      nodes: [
        {
          id: 123456,
          name: "Tournament Name",
          slug: "tournament/url-slug",
          startAt: 1691740800,  // Unix timestamp
          endAt: 1691913600,
          numAttendees: 1500,
          venueAddress: "Location",
          events: [
            {
              id: 654321,
              name: "Game Name",
              slug: "event/game-slug",
              numEntrants: 800
            }
          ]
        }
      ]
    }
  }
}
```

### Discord Event Preview
Shows how the API data gets transformed into Discord events:
- **Name**: Tournament + Game name
- **Description**: Detailed tournament info
- **Timing**: Converted from Unix timestamps
- **Location**: Venue address
- **URL**: Direct link to start.gg page

## Customizing the API Call

Edit `test-api.js` to modify:
- **GraphQL Query**: Change what data you fetch
- **Variables**: Modify country, date range, etc.
- **Processing Logic**: Change how data is transformed
- **Discord Event Format**: Customize event appearance

## Next Steps

1. **Get API credentials** and add them to `.env`
2. **Run real API test** with `npm run test-data`
3. **Modify the query** in `test-api.js` for your needs
4. **Update `app.js`** to use the real API data structure
5. **Test the full bot** with `npm start`