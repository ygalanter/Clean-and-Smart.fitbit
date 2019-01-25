
const colorPickerColors = ["#a2e4fd", "#31baff", "#0074fc", "#0000ff", "#b8b7fb", "#6685ff",
                           "#0051fc", "#0000bf", "#d9b7fa", "#9874fc", "#6839ff", "#431cbf", "blue", 
                           "#f9b6f9", "#fa73fa", "#da00cf", "#960086", "#faa3c0", "#fb5598", "magenta",
                           "#e70056", "#aa001a", "#f1d1ae", "#fb7853", "#fa3500", "#aa0c00", "red",
                           "#fde1a5", "#fea037", "#e75c00", "#8a1300", "#f9da71", "#fab900", "yellow",
                           "#ad7d00", "#503000", "#d7fa6f", "#b6fa00", "#00b900", "#007900", "green",
                           "#b6f9b5", "#51d94b", "#00aa00", "#006a00", "#b6f9d8", "#4ffa94", "cyan", 
                           "#00aa3e", "#005900", "#00fcfd", "#00e8d8", "#008888", "#003f59",
                           "#000000", "#585858", "#7c7c7c", "#9f9f9f", "#dadada", "#ffffff"
                          ];
const colors = colorPickerColors.map((color) => ({ color }));
class MySettings extends SettingsComponent {
  renderCollapsable({ key, label, content }) {
    const {
      settings: {
        [key]: openSetting = 'false'
      },
      settingsStorage
    } = this.props;
    const isOpen = JSON.parse(openSetting);
    return [
      <Button
        list
        label={ <Text bold align="left">{ isOpen ? '▼' : '►' }{'\u0009'}{label}</Text> }
        onClick={() => settingsStorage.setItem(key, isOpen ? 'false' : 'true') } />,
      isOpen && content
    ];
  }
  renderColorSelect({ title, settingsKey }) {
    return [
      <ColorSelect settingsKey={settingsKey} colors={colors} />
    ];
  }
  
  renderSlider({label, settingsKey, min, max}) {
    return [
      <Slider label={label} settingsKey={settingsKey} min={min} max={max} />
    ]
  }
  
  renderURL({label,settingsKey,URL}) {
    return [
      <TextInput label={label} settingsKey={settingsKey} name={settingsKey}/>
    ]
  }
render() {
    return (
   <Page>
      <Section
        title={<Text bold align="center">Clean and Smart settings</Text>}>
        
        
         <Select
          label={`Language`}
          settingsKey="language"
          options={[
            {name:"Catalan", value:"5"},  
            {name:"Dutch", value:"3"},
            {name:"English", value:"2"},       
            {name:"French", value:"10"},
            {name:"Hungarian", value:"8"},
            {name:"Italian", value:"1"},
            {name:"Malay", value:"6"},          
            {name:"Norvegian", value:"4"},
            {name:"Polish", value:"7"},
            {name:"Spanish", value:"9"},
            {name:"Swedish", value:"0"}
          ]}
        />
        
          <Section>
            { this.renderCollapsable({
              key: 'backgroundColorSelection',
              label: 'Background Color',
              content: [
                this.renderColorSelect({
                  settingsKey: 'backgroundColor'
                })
              ]
            })}
        </Section>
        
     <Section>
            { this.renderCollapsable({
              key: 'textColorSelection',
              label: 'Text Color',
              content: [
                this.renderColorSelect({
                  settingsKey: 'textColor'
                })
              ]
            })}
        </Section>
        
         <Section>
            { this.renderCollapsable({
              key: 'topLineColorSelection',
              label: 'Top Line Color',
              content: [
                this.renderColorSelect({
                  settingsKey: 'topLineColor'
                })
              ]
            })}
        </Section>
        
        
        
             <Section>
            { this.renderCollapsable({
              key: 'bottomLineColorSelection',
              label: 'Bottom Line Color',
              content: [
                this.renderColorSelect({
                  settingsKey: 'bottomLineColor'
                })
              ]
            })}
        </Section>
        
      
        <Select
          label={`Weather update interval`}
          settingsKey="weatherInterval"
          options={[
            {name:"Every 15 min", value:"15"},
            {name:"Every 30 min", value:"30"},
            {name:"Every hour", value:"60"}
          ]}
        />
        <Text>If you experience issues with the default weather provider - you can select a custom one below: Weatherbit or Open Weather Map. 
                  NOTE: In order to use custom provider you need to register to obtain free weather key or API key:</Text>
                  <Text>Weatherbit: https://www.weatherbit.io</Text>
                  <Text>Open Weather Map: https://www.openweathermap.org</Text>
                  <Text>Once you obtained the key, select custom weather provider below, and enter the key you obtained.</Text>
              <Select
                label={`Weather service provider`}
                settingsKey="weatherProvider"
                options={[
                  {name:"Default", value:"default"},
                  {name:"Open Weather Map", value:"owm"},
                  // {name:"Weather Underground", value:"wunderground"},
                  // {name:"Dark Sky", value:"darksky"},
                  {name:"Weatherbit", value:"weatherbit"}
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
      
        
       <Section title={<Text bold align="center">Donate!</Text>}>
      
      <Text italic>If you like this clockface and would like to see it further developed as well as other wonderful apps and faces created, please know - I run on coffee. It's an essential fuel for inspiration and creativity. So feel free to donate so I won't run out of fuel :) Thanks!
         </Text>
      
      <Link source="https://paypal.me/yuriygalanter">YURIY'S COFFEE FUND</Link> 
         
         </Section>   
      
      
    </Page>
    );
  }
}
registerSettingsPage(MySettings);
        