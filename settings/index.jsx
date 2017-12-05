function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Clean and Smart settings</Text>}>
      
        <Select
          label={`Weather update interval`}
          settingsKey="weatherInterval"
          options={[
            {name:"Every 15 min", value:"15"},
            {name:"Every 30 min", value:"30"},
            {name:"Every hour", value:"60"}
          ]}
        />
        <Select
          label={`Weather service provider`}
          settingsKey="weatherProvider"
          options={[
            {name:"Yahoo Weather", value:"yahoo"},
            {name:"Open Weather Map", value:"owm"},
            {name:"Weather Underground", value:"wunderground"},
            {name:"Dark Sky", value:"darksky"}
          ]}
        />
        <TextInput
          label="Weather Key" settingsKey="weatherAPIkey"
        />
        <Select
          label={`Temperature Format`}
          settingsKey="weatherTemperature"
          options={[
            {name:"Celsius", value:"C"},
            {name:"Fahrenheit", value:"F"}
          ]}
        /> 
        <Select
          label={`Time Separator`}
          settingsKey="timeSeparator"
          options={[
            {name:"Column", value:":"},
            {name:"Dot", value:"."}
          ]}
        />        
        
        
     </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
        