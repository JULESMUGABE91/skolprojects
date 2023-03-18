import EStyleSheet from 'react-native-extended-stylesheet';

const height = 65;

const styles = EStyleSheet.create({
  chart_survey_container: {
    backgroundColor: '$card',
    padding: 15,
    marginBottom: 15,
  },

  count_container: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },

  card_count: {
    backgroundColor: '$border',
    minWidth: 80,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  card_count_total: {
    marginBottom: 10,
    fontSize: 18,
  },

  chart_container: {
    backgroundColor: '$card',
    padding: 15,
    borderRadius: 16,
    minHeight: 200,
  },

  chart_content: {
    flex: 1,
  },

  header: {
    minHeight: 50,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
  },

  chart_per_day_card: {
    backgroundColor: '$card',
    padding: 15,
    elevation: 3,
    height: 300,
  },
});

export default styles;
