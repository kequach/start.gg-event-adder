// Test file for API data exploration
import 'dotenv/config';

// Mock data structure to show what start.gg API typically returns for Germany
const mockStartGGData = {
  data: {
    tournaments: {
      nodes: [
        {
          id: 123456,
          name: "Berlin Fighting Game Championship 2024",
          slug: "tournament/berlin-fgc-2024",
          countryCode: "DE",
          startAt: 1691740800, // Unix timestamp
          endAt: 1691913600,
          numAttendees: 300,
          venueAddress: "Messe Berlin, Messedamm 22",
          venueName: "Messe Berlin",
          city: "Berlin",
          addrState: "Berlin",
          postalCode: "14055",
          lat: 52.5055,
          lng: 13.2677,
          timezone: "Europe/Berlin",
          events: [
            {
              id: 654321,
              name: "Street Fighter 6",
              slug: "event/sf6",
              numEntrants: 150,
              videogame: {
                id: 1386,
                name: "Street Fighter 6",
                displayName: "Street Fighter 6"
              }
            },
            {
              id: 654322,
              name: "Tekken 8",
              slug: "event/tekken8",
              numEntrants: 120,
              videogame: {
                id: 1387,
                name: "Tekken 8",
                displayName: "Tekken 8"
              }
            }
          ],
          streams: [
            {
              streamName: "berlinfgc",
              streamSource: "TWITCH"
            }
          ],
          images: [
            {
              url: "https://images.start.gg/images/tournament/123456/image-abc123.png",
              type: "primary"
            }
          ]
        },
        {
          id: 123457,
          name: "Munich Gaming Festival",
          slug: "tournament/munich-gaming-2024",
          countryCode: "DE",
          startAt: 1688140800,
          endAt: 1688313600,
          numAttendees: 500,
          venueAddress: "Olympiahalle München, Spiridon-Louis-Ring 21",
          venueName: "Olympiahalle München",
          city: "München",
          addrState: "Bayern",
          postalCode: "80809",
          lat: 48.1753,
          lng: 11.5494,
          timezone: "Europe/Berlin",
          events: [
            {
              id: 654323,
              name: "Guilty Gear Strive",
              slug: "event/ggst",
              numEntrants: 200,
              videogame: {
                id: 1234,
                name: "Guilty Gear Strive",
                displayName: "Guilty Gear Strive"
              }
            }
          ],
          streams: [
            {
              streamName: "munichgaming",
              streamSource: "TWITCH"
            }
          ],
          images: [
            {
              url: "https://images.start.gg/images/tournament/123457/image-def456.png",
              type: "primary"
            }
          ]
        }
      ]
    }
  }
};

// Function to simulate API response processing
function processStartGGData(data) {
  console.log('📊 Processing Start.gg API Data Structure:');
  console.log('=====================================\n');
  
  if (!data.data || !data.data.tournaments || !data.data.tournaments.nodes) {
    console.log('❌ Invalid data structure');
    return [];
  }

  const tournaments = data.data.tournaments.nodes;
  const processedEvents = [];

  tournaments.forEach((tournament, index) => {
    console.log(`🏆 Tournament ${index + 1}: ${tournament.name}`);
    console.log(`   🌍 Country: ${tournament.countryCode || 'N/A'}`);
    console.log(`   🏙️ City: ${tournament.city || 'N/A'}, ${tournament.addrState || 'N/A'}`);
    console.log(`   📅 Start: ${tournament.startAt ? new Date(tournament.startAt * 1000).toLocaleString() : 'TBD'}`);
    console.log(`   📅 End: ${tournament.endAt ? new Date(tournament.endAt * 1000).toLocaleString() : 'TBD'}`);
    console.log(`   👥 Attendees: ${tournament.numAttendees || 'TBD'}`);
    console.log(`   📍 Venue: ${tournament.venueName || 'TBD'}`);
    console.log(`   📧 Address: ${tournament.venueAddress || 'TBD'}`);
    console.log(`   🕐 Timezone: ${tournament.timezone || 'TBD'}`);
    console.log(`   🔗 Slug: ${tournament.slug}`);
    console.log(`   🎮 Events: ${tournament.events?.length || 0}`);
    
    if (tournament.streams && tournament.streams.length > 0) {
      console.log(`   📺 Streams: ${tournament.streams.map(s => `${s.streamSource}/${s.streamName}`).join(', ')}`);
    }
    
    // Process each event within the tournament
    tournament.events?.forEach((event, eventIndex) => {
      const gameDisplay = event.videogame?.displayName || event.name;
      console.log(`      ${eventIndex + 1}. ${gameDisplay} (${event.numEntrants || 0} entrants)`);
      
      // Create Discord event data structure
      const discordEvent = {
        name: `${tournament.name} - ${gameDisplay}`,
        description: `🏆 Tournament: ${tournament.name}\n🎮 Game: ${gameDisplay}\n👥 Entrants: ${event.numEntrants || 'TBD'}\n🌍 Country: ${tournament.countryCode}\n🏙️ Location: ${tournament.city}, ${tournament.addrState}\n📍 Venue: ${tournament.venueName || tournament.venueAddress}\n🕐 Timezone: ${tournament.timezone}`,
        scheduledStartTime: tournament.startAt ? new Date(tournament.startAt * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEndTime: tournament.endAt ? new Date(tournament.endAt * 1000) : new Date(Date.now() + 26 * 60 * 60 * 1000),
        location: tournament.venueAddress || tournament.city || 'TBD',
        url: `https://start.gg/${tournament.slug}`,
        originalData: {
          tournamentId: tournament.id,
          eventId: event.id,
          slug: tournament.slug,
          countryCode: tournament.countryCode,
          city: tournament.city,
          timezone: tournament.timezone
        }
      };
      
      processedEvents.push(discordEvent);
    });
    
    console.log('');
  });

  return processedEvents;
}

// Function to show what the Discord events would look like
function showDiscordEventPreview(events) {
  console.log('🎯 Discord Event Preview:');
  console.log('========================\n');
  
  events.forEach((event, index) => {
    console.log(`Discord Event ${index + 1}:`);
    console.log(`  Name: ${event.name}`);
    console.log(`  Description: ${event.description}`);
    console.log(`  Start: ${event.scheduledStartTime.toLocaleString()}`);
    console.log(`  End: ${event.scheduledEndTime.toLocaleString()}`);
    console.log(`  Location: ${event.location}`);
    console.log(`  URL: ${event.url}`);
    console.log('');
  });
}

// Real API test function with authentication
async function testRealStartGGAPI(countryCode = 'DE', videogameIds = null) {
  console.log(`🔑 Testing Real Start.gg API for country: ${countryCode} (requires authentication)...\n`);
  
  if (!process.env.START_GG_TOKEN) {
    console.log('⚠️ No START_GG_TOKEN found in .env file');
    console.log('💡 To test with real data, add your Start.gg API token to .env:');
    console.log('   START_GG_TOKEN=your_actual_token_here\n');
    return null;
  }

  try {
    // Official start.gg query for tournaments by country with videogame filtering
    // Based on: https://developer.start.gg/docs/examples/queries/tournaments-by-location
    const query = `
      query TournamentsByCountry($cCode: String!, $perPage: Int!, $videogameIds: [ID!]) {
        tournaments(query: {
          perPage: $perPage
          filter: {
            countryCode: $cCode
            videogameIds: $videogameIds
          }
        }) {
          nodes {
            id
            name
            slug
            countryCode
            startAt
            endAt
            numAttendees
            venueAddress
            venueName
            city
            addrState
            postalCode
            lat
            lng
            timezone
            events {
              id
              name
              slug
              numEntrants
              videogame {
                id
                name
                displayName
              }
            }
            streams {
              streamName
              streamSource
            }
            images {
              url
              type
            }
          }
        }
      }
    `;

    // Parse videogame IDs from environment variable, parameter, or use default
    let gameIds;
    if (videogameIds) {
      gameIds = Array.isArray(videogameIds) ? videogameIds : [videogameIds];
    } else {
      const videogameIdsString = process.env.VIDEOGAME_IDS || "1";
      gameIds = videogameIdsString.split(',').map(id => parseInt(id.trim()));
    }

    const variables = {
      cCode: countryCode.toUpperCase(),
      perPage: 10,
      videogameIds: gameIds
    };

    console.log(`📡 Querying tournaments for country code: ${variables.cCode}`);
    console.log(`🎮 Filtering by videogame IDs: ${variables.videogameIds.join(', ')}`);
    console.log(`📊 Requesting up to ${variables.perPage} tournaments\n`);

    const response = await fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.START_GG_TOKEN}`,
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ GraphQL Errors:', JSON.stringify(data.errors, null, 2));
      throw new Error('GraphQL query returned errors');
    }

    console.log('✅ Real API Response:');
    console.log(JSON.stringify(data, null, 2));
    return data;

  } catch (error) {
    console.error('❌ Real API Error:', error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Start.gg API Data Structure Test (Germany Focus)');
  console.log('==================================================\n');
  
  // Get country code from command line arguments or use default
  const countryArg = process.argv.find(arg => arg.startsWith('--country='));
  const countryCode = countryArg ? countryArg.split('=')[1] : 'DE';
  
  // Get videogame IDs from command line arguments or environment
  const gameArg = process.argv.find(arg => arg.startsWith('--games='));
  let videogameIds = null;
  if (gameArg) {
    videogameIds = gameArg.split('=')[1].split(',').map(id => parseInt(id.trim()));
  }
  
  console.log(`🌍 Testing for country: ${countryCode.toUpperCase()}`);
  if (videogameIds) {
    console.log(`🎮 Filtering by videogame IDs: ${videogameIds.join(', ')}`);
  } else {
    const defaultIds = process.env.VIDEOGAME_IDS || "1";
    console.log(`🎮 Using default videogame IDs: ${defaultIds}`);
  }
  console.log('');
  
  // Test with mock data first
  console.log('1️⃣ Testing with Mock Data (German tournaments):\n');
  const processedEvents = processStartGGData(mockStartGGData);
  showDiscordEventPreview(processedEvents);
  
  // Test with real API if token is available
  console.log('2️⃣ Testing with Real API:\n');
  const realData = await testRealStartGGAPI(countryCode, videogameIds);
  
  if (realData) {
    console.log('\n📊 Processing Real API Data:\n');
    const realEvents = processStartGGData(realData);
    showDiscordEventPreview(realEvents);
  }
  
  console.log('✅ Test completed!');
  console.log('\n💡 Tips:');
  console.log('   - Use --country=US to test with US tournaments');
  console.log('   - Use --country=JP to test with Japanese tournaments');
  console.log('   - Use --games=1,1386 to filter for specific videogames');
  console.log('   - Common game IDs: 1=Melee, 1386=Ultimate, 43868=SF6, 49783=Tekken8');
  console.log('   - Add START_GG_TOKEN to .env for real API data');
}

// Run the tests
runTests();