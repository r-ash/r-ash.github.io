malawi <- rgdal::readOGR("MWI_adm/MWI_adm2.shp", GDAL1_integer64_policy = TRUE)

library(leaflet)
leaflet(malawi) %>% addPolygons(data = malawi, weight = 2, col = "black", fillOpacity = 0.2,
                                highlight = highlightOptions(color = 'white', weight = 1, bringToFront = TRUE),
                                label = malawi@data$NAME_1)
load("data/mwsh.rda")
shape <- sf::st_as_sf(mwsh)

read_outputs <- function(path) {
  files <- utils::unzip("data/output/output_v2019-02-21.zip", list = TRUE)
  data <- list()
  for (file in files$Name[-c(1, grep("MACOSX", files$Name))]) {
    con <- unz(path, file)
    data[[basename(file)]] <- read.csv(con, header = TRUE, sep = ",")
  }
  data
}

outputs <- read_outputs("data/output/output_v2019-02-21.zip")

district_data <- outputs[["out_aggr_district_v2019-02-21.csv"]]
district_prev <- district_data[district_data$indicator == "prevalence", ]
district_prev <- district_prev[district_prev$period == "2018 Q3", ]

colours <- colorQuantile("YlGn", district_prev$mean)
leaflet(shape) %>% addPolygons(data = shape, weight = 2, fillOpacity = 0.2,
                               color = ~colours(district_prev$mean),
                               highlight = highlightOptions(color = 'white' , weight = 1, bringToFront = TRUE),
                               label = shape$district)



both_sexes <- district_prev[
  district_prev$sex == "both" & 
    district_prev$agegr == "15+" & 
    district_prev$survey_prevalence == "both",] 
female <- district_prev[
  district_prev$sex == "female" & 
    district_prev$agegr == "15+" & 
    district_prev$survey_prevalence == "both",] 
male <- district_prev[
  district_prev$sex == "male" & 
    district_prev$agegr == "15+" & 
    district_prev$survey_prevalence == "both",] 
both_sex_labels <- sprintf(
  "<strong>%s</strong><br/>%g", both_sexes$district, 
  round(both_sexes$mean, digits = 4)) %>% lapply(htmltools::HTML)
female_labels <- sprintf(
  "<strong>%s</strong><br/>%g", female$district, 
  round(female$mean, digits = 4)) %>% lapply(htmltools::HTML)
male_labels <- sprintf(
  "<strong>%s</strong><br/>%g", male$district, 
  round(male$mean, digits = 4)) %>% lapply(htmltools::HTML)
label_options <- labelOptions(
  style = list("font-weight" = "normal", padding = "3px 8px"),
  textsize = "15px",
  direction = "auto"
)
colours <- colorBin("YlGn", c(both_sexes$mean, female$mean, male$mean))
m <- leaflet(shape) %>% addPolygons(
  color = ~colours(both_sexes$mean),
  weight = 2,
  fillOpacity = 0.7,
  highlight = highlightOptions(color = 'white', weight = 1, bringToFront = TRUE),
  label = both_sex_labels,
  labelOptions = label_options
) %>% addLegend(
  pal = colours, values = ~mean, opacity = 0.7, title = "Prevalence", position = "bottomright"
)


m <- leaflet()
m %>% addPolygons(
  data = shape,
  group = "Both",
  color = ~colours(both_sexes$mean),
  weight = 2,
  fillOpacity = 0.7,
  highlight = highlightOptions(color = 'white', weight = 1, bringToFront = TRUE)
  #label = both_sex_labels,
  #labelOptions = label_options
) %>% addPolygons(
  data = shape,
  group = "Female",
  color = ~colours(female$mean),
  weight = 2,
  fillOpacity = 0.7,
  highlight = highlightOptions(color = 'white', weight = 1, bringToFront = TRUE)
  #label = female_labels,
  # labelOptions = label_options
) %>% addPolygons(
  data = shape,
  group = "Male",
  color = ~colours(male$mean),
  weight = 2,
  fillOpacity = 0.7,
  highlight = highlightOptions(color = 'white', weight = 1, bringToFront = TRUE)
  # label = male_labels,
  # labelOptions = label_options
) %>% addLayersControl(
  baseGroups = c("Both", "Female", "Male"),
  options = layersControlOptions(collapsed = FALSE)
) %>% addLegend(
  pal = colours, values = ~mean, opacity = 0.7, title = "Prevalence", position = "bottomright"
)

## Output maps as geojson
load("data/mwsh.rda")
shape <- sf::st_as_sf(mwsh)
json <- geojsonio::geojson_json(shape)
geojsonio::geojson_write(json, file = "malawi.geojson")

## Output some data
jsonlite::write_json(district_prev, path = "district_prev.json")

