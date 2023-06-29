
const analyticsPartials = {
  hikesInCategory(hikes) {
    return hikes.length;
  },
  totalDistanceInCategory(hikes) {
    let total = 0;
    for (let i = 0; i < hikes.length; i+=1) {
      total += hikes[i].distance;
    }
    return total;
  },
  averageDistanceInCategory(hikes) {
    let total = 0;
    for (let i = 0; i < hikes.length; i+=1) {
      total += hikes[i].distance;
    }
    return total / hikes.length || 0;
  },
  totalDurationInCategory(hikes) {
    let total = 0;
    for (let i = 0; i < hikes.length; i+=1) {
      total += hikes[i].duration;
    }
    return total;
  },
  averageDurationInCategory(hikes) {
    let total = 0;
    for (let i = 0; i < hikes.length; i+=1) {
      total += hikes[i].duration;
    }
    return total / hikes.length || 0;
  },
};

export const analyticsUtils = {
  getAllAnalytics(category) {
    category.numberOfHikes = analyticsPartials.hikesInCategory(category.hikes);
    category.totalDistance = analyticsPartials.totalDistanceInCategory(
      category.hikes
    );
    category.averageDistance = analyticsPartials.averageDistanceInCategory(
      category.hikes
    );
    category.totalDuration = analyticsPartials.totalDurationInCategory(
      category.hikes
    );
    category.averageDuration = analyticsPartials.averageDurationInCategory(
      category.hikes
    );
    return category;
  },
};
