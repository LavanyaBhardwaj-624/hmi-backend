const alarmModel = require('../../models/alarm.model.js');
const thresholdModel = require('../../models/threshold.model.js')

const ALARM_CONFIG = {
  "Boiler Unit": {
    "Temperature": { unit: "°C", high: "High Temperature", low: "Low Temperature" },
    "Pressure": { unit: "PSI", high: "High Steam Pressure", low: "Low Steam Pressure" },
    "Water Level": { unit: "L", high: "High Water Level", low: "Low Water Level" },
  },
  "Conveyor Belt": {
    "Speed": { unit: "m/min", high: "Belt Running Too Fast", low: "Belt Running Too Slow" },
    "Load": { unit: "kg", high: "Overload Detected" },
    "Vibration": { unit: "mm/s", high: "Abnormal Vibration" },
    "Motor Temp": { unit: "°C", high: "Motor Overheating" },
  },
  "Packaging Line": {
    "Temperature": { unit: "°C", high: "High Temperature", low: "Low Temperature" },
    "Pressure": { unit: "bar", high: "High Line Pressure", low: "Low Line Pressure" },
    "Speed": { unit: "units/min", high: "Line Running Too Fast", low: "Line Running Too Slow" },
    "Load": { unit: "kg", high: "Overload Detected" },
    "Vibration": { unit: "mm/s", high: "Abnormal Vibration" },
  },
};

const CRITICAL_WARNING_CONFIG = {
  "Boiler Unit": {
    "Temperature": { 
      unit: "°C", 
      highCritical: "Temperature Rising above threshold value - Need to Cool Down Soon", 
      lowCritical: "Temperature Dropping below threshold value - Stabilize Heating" 
    },
    "Pressure": { 
      unit: "PSI", 
      highCritical: "Steam Pressure Rising above threshold value - need to Release Pressure", 
      lowCritical: "Steam Pressure Falling below the threshold value - Check Supply" 
    },
    "Water Level": { 
      unit: "L", 
      highCritical: "Water Level Increasing - Adjust Feed", 
      lowCritical: "Water Level Dropping - Refill Required" 
    },
  },
  "Conveyor Belt": {
    "Speed": { 
      unit: "m/min", 
      highCritical: "Speed Approaching Limit - Slow Down", 
      lowCritical: "Speed Too Low - Increase Flow" 
    },
    "Load": { 
      unit: "kg", 
      highCritical: "Load Near Limit - Reduce Input" 
    },
    "Vibration": { 
      unit: "mm/s", 
      highCritical: "Vibration Increasing - Inspect Early" 
    },
    "Motor Temp": { 
      unit: "°C", 
      highCritical: "Motor Temperature Rising - Cool Down" 
    },
  },
  "Packaging Line": {
    "Temperature": { 
      unit: "°C", 
      highCritical: "Line Temperature Rising - Cool Down", 
      lowCritical: "Line Temperature Dropping - Stabilize Heating" 
    },
    "Pressure": { 
      unit: "bar", 
      highCritical: "Line Pressure Rising - Stabilize", 
      lowCritical: "Line Pressure Dropping - Check Supply" 
    },
    "Speed": { 
      unit: "units/min", 
      highCritical: "Speed Approaching Limit - Adjust Flow", 
      lowCritical: "Speed Too Low - Increase Throughput" 
    },
    "Load": { 
      unit: "kg", 
      highCritical: "Load Near Threshold - Reduce Input" 
    },
    "Vibration": { 
      unit: "mm/s", 
      highCritical: "Vibration Increasing - Inspect Early" 
    },
  },
};

function getBreach(value , machineType , field , thresholdvalue) {
  if (value === null || value === undefined ||  !machineType || !field || !thresholdvalue) return null;

  const highvalue = Number(thresholdvalue.high)
  const haslowvalue = thresholdvalue.low ? true : false;
  
  console.log(`checks : ${ value} , ${highvalue}`)
  if( (value < thresholdvalue.high) ||  ( haslowvalue && value > thresholdvalue.low) ){
     if( value >= (highvalue - 2)){
        return { severity: "critical" , direction: "high", limit: thresholdvalue.high, message: CRITICAL_WARNING_CONFIG[machineType][field].highCritical }
     }
     if( haslowvalue && (value <= (thresholdvalue.low + 2))){
        return { severity: "critical" , direction: "low", limit: thresholdvalue.low, message: CRITICAL_WARNING_CONFIG[machineType][field].lowCritical}
     }
  }
  else {
        if( value >= highvalue){
        return { severity: "warning" , direction: "high", limit: thresholdvalue.high , message: ALARM_CONFIG[machineType][field].high}
     }
    if ( haslowvalue && (value <= thresholdvalue.low)) {
      return { severity: "warning", direction: "low", limit: thresholdvalue.low , message: ALARM_CONFIG[machineType][field].low};
    }
  }
 
  return null;
}


async function  addalarms( machine, currentdata){

     
  try{
    const thresholdObject = await thresholdModel.findOne({companyId: machine.companyId , machineId: machine._id})
    if (!thresholdObject) {
    return;
    }
    const threshold = thresholdObject.thresholds;
  
   for (const key of threshold.keys()){

      const limits =  threshold.get(key);

  
       console.log(key , limits)
      const value = currentdata[key];
      const obj = getBreach(value , machine.machineType , key , limits);
      
      if(obj === null ){
        const findalarm = await alarmModel.findOneAndUpdate({ 
        companyId: machine.companyId, 
         machineId: machine._id,
         status: "active" ,
         field: key,
      },{
        $set:{
           actualValue: value,
           status: "resolved" ,
           acknowledgedBy: null,
        }
       },{
          returnDocument: 'after',
          setDefaultsOnInsert: true
       });
       continue;
      }
      const alarm = await alarmModel.findOneAndUpdate({ 
        companyId: machine.companyId, 
         machineId: machine._id,
         status: "active" ,
         field: key,
      } ,{
           companyId: machine.companyId,
           machineId: machine._id,
           machineType: machine.machineType,
           field: key,
           message: obj.message,
           actualValue: value,
           threshold: obj.limit,
           status: "active"  ,
           acknowledgedBy: null,
           severity: obj.severity,
           direction: obj.direction
       } , {
          upsert: true,
          returnDocument: 'after',
          setDefaultsOnInsert: true
       })
    }
        
      }catch(err){
           console.log(`alarm couldn't  be add : ${err.message}`)
      }
}



module.exports = addalarms