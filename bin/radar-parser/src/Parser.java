import java.util.ArrayList;
import java.util.Date;
import java.util.Formatter;

import ucar.nc2.VariableSimpleIF;
import ucar.nc2.constants.FeatureType;
import ucar.nc2.dt.RadialDatasetSweep;
import ucar.nc2.ft.FeatureDataset;
import ucar.nc2.ft.FeatureDatasetFactoryManager;

import com.google.gson.*;

public class Parser {

	public static void main(String[] args) {
		try {
			String fileIn = args[0];
			
			JsonObject mainObject = new JsonObject();

			Formatter errlog = new Formatter();
			FeatureDataset fdataset = FeatureDatasetFactoryManager.open(
					FeatureType.RADIAL, fileIn, null, errlog);
			if (fdataset == null) {
				System.err.printf("**failed on {} %n --> {} %n\n", fileIn,
						errlog);
				return;
			}

			FeatureType ftype = fdataset.getFeatureType();
			assert (ftype == FeatureType.RADIAL);
			RadialDatasetSweep rds = (RadialDatasetSweep) fdataset;

			// Radar information
			String stationID = rds.getRadarID();
			String stationName = rds.getRadarName();
			boolean isVolume = rds.isVolume();
			Date stationTime = rds.getEndDate();

			mainObject.addProperty("stationID", stationID);
			mainObject.addProperty("stationName", stationName);
			mainObject.addProperty("isVolume", isVolume);
			mainObject.addProperty("lat", rds.getCommonOrigin().getLatitude());
			mainObject.addProperty("lon", rds.getCommonOrigin().getLongitude());

			// Read a radial variable
			ArrayList<VariableSimpleIF> vars = new ArrayList<VariableSimpleIF>(
					rds.getDataVariables());
			RadialDatasetSweep.RadialVariable varRef = (RadialDatasetSweep.RadialVariable) rds
					.getDataVariable("BaseReflectivity");

			// Read a single sweep
			int sweepNum = 0;
			RadialDatasetSweep.Sweep sweep = varRef.getSweep(sweepNum);

			float meanElev = sweep.getMeanElevation();
			int nrays = sweep.getRadialNumber();
			float beamWidth = sweep.getBeamWidth();
			int ngates = sweep.getGateNumber();
			float gateSize = sweep.getGateSize();

			mainObject.addProperty("meanElev", meanElev);
			mainObject.addProperty("nrays", nrays);
			mainObject.addProperty("beamWidth", beamWidth);
			mainObject.addProperty("ngates", ngates);
			mainObject.addProperty("gateSize", gateSize);
			
			JsonArray rays = new JsonArray();

			// Read data variable at radial level -
			// this is where actual data is read
			// into memory
			for (int i = 0; i < nrays; i++) {
				float azimuth = sweep.getAzimuth(i);
				float elevation = sweep.getElevation(i);
				float[] data = sweep.readData(i);
				
				JsonObject ray = new JsonObject();
				ray.addProperty("azimuth", azimuth);
				ray.addProperty("elevation", elevation);

				JsonArray gates = new JsonArray();
				for (int j = 0; j < ngates; j++) {
					float val = data[j];
					if (val != val)
						gates.add(new JsonPrimitive("NaN"));
					else
						gates.add(new JsonPrimitive(val));
				}
				ray.add("gates", gates);
				
				rays.add(ray);
			}
			
			mainObject.add("rays", rays);
			mainObject.addProperty("time", sweep.getTime(0));
			
			System.out.println(mainObject.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
