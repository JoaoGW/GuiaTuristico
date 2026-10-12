import { Alert } from 'react-native';

import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

type DayItineraryTypes = {
  day: number,
  date: string,
  location: string,
  timeline: {
    time: string,
    title: string,
    description: string,
    coordinates?: string,
    category: string
  }[],
  suggestedActivities?: string[],
  pixabayTags?: string,
  images?: string[]
}

type ExportItineraryParams = {
  itinerary: DayItineraryTypes[],
  title?: string,
  dateBegin?: string,
  dateEnd?: string,
  fileName?: string
}

const createHtmlFromItinerary = (itineraryData: DayItineraryTypes[]) => {
  let htmlDays = '';

  itineraryData.forEach((day, index) => {
    const isEven = index % 2 === 0;
    const bgColor = isEven ? '#f8f9fa' : '#ffffff';
    
    const dayTitle = `Dia ${day.day}`;
    const dateFormatted = day.date;
    const location = day.location ? day.location : '';
    
    const activityItems = day.timeline
      .map((activity, idx) => {
        const activityBg = idx % 2 === 0 ? 'rgba(39, 82, 183, 0.03)' : 'rgba(39, 82, 183, 0.06)';
        return `
          <div style="
            background: ${activityBg};
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid #2752b7;
          ">
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
              <span style="
                background: #2752b7;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 10pt;
                font-weight: 600;
                margin-right: 10px;
              ">${activity.time}</span>
              <span style="font-weight: 600; color: #1a1a1a; font-size: 11pt;">${activity.title}</span>
            </div>
            <p style="margin: 0; color: #555; font-size: 10pt; line-height: 1.5; padding-left: 4px;">${activity.description}</p>
          </div>
        `;
      })
      .join('');

    htmlDays += `
      <div style="
        background: ${bgColor};
        padding: 20px;
        margin-bottom: 25px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      ">
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 12px;
          border-bottom: 3px solid #2752b7;
        ">
          <h2 style="
            margin: 0;
            color: #2752b7;
            font-size: 18pt;
            font-weight: 700;
          ">${dayTitle}</h2>
          <span style="
            color: #666;
            font-size: 11pt;
            font-weight: 600;
          ">${dateFormatted}</span>
        </div>
        ${location ? `<p style="
          color: #2752b7;
          font-size: 11pt;
          margin: -8px 0 15px 0;
          font-weight: 600;
        ">📍 ${location}</p>` : ''}
        ${activityItems}
      </div>
    `;

    // Adicionar atividades sugeridas se existirem
    if (day.suggestedActivities && day.suggestedActivities.length > 0) {
      const suggestedItems = day.suggestedActivities
        .map(activity => `
          <li style="
            color: #555;
            padding: 8px 12px;
            margin-bottom: 6px;
            background: rgba(39, 82, 183, 0.05);
            border-radius: 6px;
          ">✨ ${activity}</li>
        `)
        .join('');
      htmlDays += `
        <div style="
          background: #fff9e6;
          padding: 15px;
          margin: -10px 0 25px 0;
          border-radius: 8px;
          border: 2px dashed #2752b7;
        ">
          <h3 style="
            font-size: 12pt;
            color: #2752b7;
            margin: 0 0 10px 0;
            font-weight: 700;
          ">Atividades Sugeridas</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">${suggestedItems}</ul>
        </div>
      `;
    }
  });

  return htmlDays;
};

export async function exportItineraryToPDF({ itinerary, title = "Roteiro de Viagem", dateBegin, dateEnd, fileName }: ExportItineraryParams) {
  if (!itinerary || itinerary.length === 0) {
    Alert.alert("Exportar PDF", "Não há itinerário para exportar.");
    return;
  }

  try {
    const dateInfo = dateBegin && dateEnd ? `<p class="subtitle">${dateBegin} até ${dateEnd}</p>` : '';
    
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Poppins', sans-serif; 
              font-size: 11pt; 
              line-height: 1.6; 
              padding: 30px;
              color: #333;
              background: #ffffff;
            }
            
            h1 { 
              text-align: center; 
              color: #2752b7; 
              font-size: 28pt;
              margin-bottom: 8px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            
            .subtitle {
              text-align: center;
              font-size: 12pt;
              color: #666;
              margin: 5px 0 30px 0;
              font-weight: 500;
            }
            
            .tagline {
              text-align: center;
              font-size: 10pt;
              color: #444;
              margin-bottom: 40px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          ${dateInfo}
          <p class="tagline">Seu roteiro de viagem personalizado com muito carinho</p>
          ${createHtmlFromItinerary(itinerary)}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (!await Sharing.isAvailableAsync()) {
      Alert.alert("Exportar PDF", "Compartilhamento não está disponível neste dispositivo.");
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Salve ou compartilhe seu roteiro',
      UTI: '.pdf'
    });
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    Alert.alert("Erro", "Não foi possível exportar o roteiro.");
  }
}