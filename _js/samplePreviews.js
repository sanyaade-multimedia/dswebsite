var data = [];
data.push('Travel,0.jpg');
data.push('Health Club,1.jpg');
data.push('Gym,2.jpg');
data.push('Flower Shop,3.jpg');
data.push('Car dealer ship,4.jpg');
data.push('Hair Salon,5.jpg');
data.push('Home and Garden,6.jpg');
data.push('Hotel Lobby,7.jpg');
data.push('Hobby Shop,8.jpg');
data.push('Pet Shop,9.jpg');
data.push('Sports Bar,10.jpg');
data.push('Museum,11.jpg');
data.push('Coffee Shop,12.jpg');
data.push('Bank,13.jpg');
data.push('Gas Station,14.jpg');
data.push('Sushi Restaurant,15.jpg');
data.push('Casino,16.jpg');
data.push('Bicycle Shop,17.jpg');
data.push('Tanning Salon,18.jpg');
data.push('Pharmacy,19.jpg');
data.push('Laser Away,20.jpg');
data.push('Dentistry,21.jpg');
data.push('Clothing store,22.jpg');
data.push('Golf club,23.jpg');
data.push('RC Helis,24.jpg');
data.push('Food Menu boards,25.jpg');
data.push('7 Eleven,26.jpg');
data.push('Subway,27.jpg');
data.push('Super Market,28.jpg');
data.push('Investment Group,29.jpg');
data.push('Synagogue,30.jpg');
data.push('Dry Cleaning,31.jpg');
data.push('Ice Cream Shop,32.jpg');
data.push('Real Estate office,33.jpg');
data.push('Night Club,34.jpg');
data.push('Hockey,35.jpg');
data.push('Train Station,36.jpg');
data.push('Realtor,37.jpg');
data.push('Toy Store,38.jpg');
data.push('Indian Restaurant,39.jpg');
data.push('Library,40.jpg');
data.push('Movie Theater,41.jpg');
data.push('Airport,42.jpg');
data.push('LAX,43.jpg');
data.push('Parks and Recreations,44.jpg');
data.push('Motel,45.jpg');
data.push('Corner Bakery,46.jpg');
data.push('Retirement home,47.jpg');
data.push('Navy recruiting office,48.jpg');
data.push('Martial arts school,49.jpg');
data.push('Supercuts,50.jpg');
data.push('The UPS Store,51.jpg');
data.push('Cruise One,52.jpg');
data.push('Car services,53.jpg');
data.push('fedex kinkos,54.jpg');
data.push('veterinarian,55.jpg');
data.push('YMCA,56.jpg');
data.push('Tax services,57.jpg');
data.push('Wedding planner,58.jpg');
data.push('Cleaning services,59.jpg');
data.push('Pet Training,60.jpg');
data.push('Gymboree Kids,61.jpg');
data.push('Trader Joes,62.jpg');
data.push('Men Haircuts,63.jpg');
data.push('Jiffy Lube,64.jpg');
data.push('Toyota car dealer,65.jpg');
data.push('Winery,66.jpg');
data.push('Savings and Loans,67.jpg');
data.push('Nail Salon,68.jpg');
data.push('Weight Watchers,69.jpg');
data.push('Dollar Tree,70.jpg');
data.push('Western Bagles,71.jpg');
data.push('Kaiser Permanente,72.jpg');
data.push('Church,73.jpg');
data.push('Dr.Waiting Room,74.jpg');
data.push('College,75.jpg');
data.push('Funeral home,76.jpg');
data.push('NFL Stadium,77.jpg');
data.push('University Campus,78.jpg');
data.push('Day care,79.jpg');
data.push('GameStop,80.jpg');
data.push('Starbucks,81.jpg');
data.push('General Hospital,82.jpg');
data.push('Del Taco,83.jpg');
data.push('training and fitness,84.jpg');
data.push('winery,85.jpg');
data.push('Law Firm,86.jpg');
data.push('High school K12 hall,87.jpg');

$(function () {
    var $samples = $('#samples');
    for (var i = 0; i < data.length; i++) {
        var d = data[i].split(',');
        var name = d[0];
        var img = d[1];
        var snippet = '<li class="liveSampleNoSpace liveSamples">';
        snippet += '<p class="robotoMajotHeader sampleHeading liveSampleNoSpace">' + name + '</p>';
        snippet += '<img class="liveSampleNoSpace" src="/_images/samples/' + img + '"/>';
        snippet += '<li>';
        $samples.append(snippet);
    }
});
