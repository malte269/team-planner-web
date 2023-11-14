<template>
  <div>
    <v-menu ref="menu"
            v-model="menuFlag"
            :attach="attach"
            :close-on-content-click="false"
            :left="left"
            :max-width="type === 'time' ? TIME_MENU_WIDTH : 290"
            nudge-bottom="10"
            offset-overflow
            offset-y
            origin="center"
            transition="scale-transition">
      <template #activator="{ on }">
        <v-text-field
            ref="menuTextField"
            v-model="displayValue"
            :background-color="alternativeDesign ? 'background' : 'decent-gray'"
            :class="{'custom no-input-change': alternativeDesign, 'no-border': displayValue}"
            :clearable="isClearable"
            :disabled="disabled"
            :error-messages="internalError || errorMessages"
            :filled="!alternativeDesign"
            :height="alternativeDesign ? 26 : 47"
            :label="label"
            :placeholder="placeHolder || defaultPlaceholder"
            class="activator-input"
            color="on-navigation-bg-text"
            dense
            hide-details
            @blur="formatTime()"
            @click="on.click"
            @click:clear="clearPicker">
          <template v-if="!alternativeDesign" #append>
            <v-icon v-if="type==='date'" color="on-navigation-bg" @click="openMenu()">
              mdi-calendar-range-outline
            </v-icon>
            <v-icon v-else color="on-navigation-bg" @click="openMenu()">
              mdi-clock-outline
            </v-icon>
          </template>
        </v-text-field>
      </template>
      <!--<v-date-picker
        v-if="type==='date'"
        v-model="pickerValue"
        no-title
        color="primary"
        :max="dateMinMax!.max"
        :min="dateMinMax!.min"
        first-day-of-week="1"
        scrollable
        @click:date="onInputChange(pickerValue)">
      </v-date-picker>
      <v-list v-else height="200" :max-width="TIME_MENU_WIDTH">
        <v-list-item-group v-model="returnValue" @change="onInputChange" class="time-picker-list">
          <v-list-item v-for="(item, index) in givenMinutes" :key="index" :value="item">
            <v-list-item-content>
              <v-list-item-title v-text="item" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>-->
    </v-menu>
    <div v-if="!alternativeDesign && (errorMessages && errorMessages.length>0 || internalError)"
         class="errors error--text px-1">
      {{ internalError || errorMessages }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DateTime } from 'luxon';

class MinMax {
  max!: string;
  min!: string;
}

defineComponent({
  emits: ['update:returnValue'],
  props: {
    /**
     * The date from the datePicker as ISOString
     */
    returnValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      defaultPlaceholder: String(''),
      internalError: String(''),
      /**
       * Menu flag for date menu
       */
      menuFlag: Boolean(false),
      internalChange: Boolean(false),
      pickerValue: String(''),
      displayDate: String(''),
    };
  },
  computed: {
    displayValue: {
      /**
       * Humanized date string
       */
      get() {
        return this.displayDate;
      },
      /**
       * This is executed if the textField is not readonly. In this case it is used in timePicker mode only
       * @param newValue
       * @private
       */
      set(newValue: string) {
        if (this.type === 'date') {
          this.displayDate = this.validateDate(newValue);
        } else {
          this.displayDate = value;
        }
      },
    },
  },
});
export default defineComponent({
  emits: ['update:returnValue'],
  props: {
    /**
     * The date from the datePicker as ISOString
     */
    returnValue: {
      type: String,
      required: true,
    },
    /**
     * Min max values for date start picker
     */
    dateMinMax: {
      type: MinMax,
      required: false,
      default() {
        return { min: '', max: '' };
      },
    },
    /**
     * The label to be displayed
     */
    label: {
      type: String,
      required: false,
      default: '',
    },
    /**
     * Should it be a datePicker or a timePicker
     * date ore time
     */
    type: {
      type: String,
      required: false,
      default: 'date',
    },
    clearable: {
      type: Boolean,
      required: false,
      default: false,
    },
    errorMessages: {
      type: Array<string>,
      required: false,
      default: '',
    },
    alternativeDesign: {
      type: Boolean,
      required: false,
      default: false,
    },
    placeHolder: {
      type: String,
      required: false,
      default: '',
    },
    left: {
      type: Boolean,
      required: false,
      default: false,
    },
    attach: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      defaultPlaceholder: String(''),
      internalError: String(''),
      /**
       * Menu flag for date menu
       */
      menuFlag: Boolean(false),
      internalChange: Boolean(false),
      pickerValue: String(''),
      displayDate: String(''),
    };
  },
  computed: {
    TIME_MENU_WIDTH() {
      return 200;
    },
    displayValue: {
      /**
       * Humanized date string
       */
      get() {
        return this.displayDate;
      },
      /**
       * This is executed if the textField is not readonly. In this case it is used in timePicker mode only
       * @param newValue
       * @private
       */
      set(newValue: string) {
        if (this.type === 'date') {
          this.displayDate = this.validateDate(newValue);
        } else {
          this.displayDate = value;
        }
      },
    },
    /**
     * Method to fill the timepicker-list with half-hour times
     */
    givenMinutes(): string[] {
      const times: string[] = [];
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 2; m++) {
          times.push(`${ h }`.padStart(2, '0') + ':' + `${ m * 30 }`.padStart(2, '0'));
        }
      }
      return times;
    },
    isClearable() {
      return !!(this.clearable && this.returnValue);
    },
  },
  mounted() {
    // this.watchValue();
  },
  methods: {
    /**
     * Removes the inputs from the dateEnds
     */
    clearPicker() {
      this.resetValues();
      this.openMenu();
    },
    onInputChange(pickerValue: string) {
      if (pickerValue && pickerValue.length > 0) {
        this.internalChange = true;
        if (this.type === 'date') {
          this.returnValue = DateTime.fromISO(pickerValue).toISO() as string;
          this.displayDate = DateTime.fromISO(pickerValue).toFormat('DD.MM.YYYY');
        } else {
          this.returnValue = this.displayDate = pickerValue;
        }
        this.menuFlag = false;
      }
    },
    validateDate(date: string): string {
      if (date) {
        this.internalError = '';
        const dateArray = date.split('.');
        const dateMoment = DateTime.fromFormat(`${ dateArray[1] }-${ dateArray[0] }-${ dateArray[2] }`, '');
        if (!dateMoment.isValid || dateArray[2].length < 4) {
          this.resetValues();
          return date;
        }
        const beforeMinDate = this.dateMinMax!.min && dateMoment.isBefore(this.dateMinMax.min, 'day');
        const afterMaxDate = this.dateMinMax!.max && dateMoment.isAfter(this.dateMinMax.max, 'day');
        if (beforeMinDate || afterMaxDate) {
          const messageType = beforeMinDate ? 'MINVALUE' : 'MAXVALUE';
          const edgeDate = (beforeMinDate ? moment(this.dateMinMax.min) : moment(this.dateMinMax.max))
              .format(this.$t('GENERAL.DATE_FORMATS.DATE').toString()).toString();
          // set both, min and max. The right value will be selected
          this.internalError = this.$t(`ERROR_MESSAGES.${ messageType }`, { min: edgeDate, max: edgeDate }).toString();
          this.resetValues();
          return date;
        }
        this.pickerValue = dateMoment.clone().format(this.$t('GENERAL.DATE_FORMATS.PICKER_DATE').toString());
        this.returnValue = dateMoment.clone().toISOString();
        this.internalChange = true;
        // this is an edge case. If you type 29.2.YYYY and there is no 29.2 then the date is set to 1.3.YYYY. Maybe it
        // occurs somewhere else. Another case, the entry 012 for the month is valid too. Comparing numbers does not the job,
        // so compare the strings
        if (`${ dateMoment.get('month') + 1 }` !== dateArray[1]) {
          return dateMoment.format(this.$t('GENERAL.DATE_FORMATS.DATE').toString());
        }
      }
      return date;
    },
    /**
     * Formats the returned and displayed value of the textField in timepicker mode, when blurred
     * @private
     */
    formatTime() {
      // do it if no errors occurred and the string has no maximum length of 5
      if (this.type === 'time') {
        if (this.displayValue.length > 0 && this.displayValue.length <= 5) {
          const parts = this.displayValue.split(':');
          if (parts.length === 1) {
            parts.push('');
          }
          this.internalError = '';
          // add a 0 in case the number is a single digit so something like 2:3 is possible and means 02:03
          // 4: --> 04:00 is possible too or even 4
          this.returnValue = this.displayValue = parts.map((part) => part.length < 2 ? part.length === 0 ? '00' : `0${ part }` : part).join(':');
          this.internalChange = true;
        } else if (this.displayValue.length > 5) {
          this.internalError = this.$t('ERROR_MESSAGES.MAXLENGTH', { max: 5 }).toString();
          this.returnValue = '';
          this.internalChange = true;
        }
      }
    },
    openMenu() {
      (this.$refs.menuTextField as any).$refs.input.click();
    },
    resetValues() {
      // Don't reset the values, in case there are none. Otherwise, the ErrorState of parentComponents will occur every
      // time someone writes a date manually, because the date is invalid, and the returnValues value is changed from
      // undefined/null to empty string
      if (this.returnValue) {
        this.pickerValue = '';
        this.returnValue = '';
      }
    },
  },
  watch: {
    returnValue() {
      // I'm not proud... other ideas?
      // Only changes from outer should trigger this. Otherwise, the usability is a bit bad. If a date is valid, it will
      // jump to the end of the string in the textfield
      if (!this.internalChange) {
        if (this.type === 'date') {
          this.defaultPlaceholder = this.$t('GENERAL.DATE_FORMATS.PLACEHOLDER').toString();
          if (this.returnValue) {
            // set displayDate and picker value. Don't use validateDate here, because in case there are max and min dates,
            // like in the cleanTimeComponent, that are based on the current day, the value of the picker would be invalid
            this.displayDate = moment(this.returnValue).format(this.$t('GENERAL.DATE_FORMATS.DATE').toString());
            this.pickerValue = moment(this.returnValue).format(this.$t('GENERAL.DATE_FORMATS.PICKER_DATE').toString());
          } else {
            this.displayDate = '';
            this.pickerValue = '';
          }
        } else {
          this.displayDate = this.returnValue;
        }
      } else {
        this.internalChange = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.errors {
  top: -20px;
  min-height: 20px;
  font-size: 12px;
}

.time-picker-list {
  background: var(--v-background-base);
}

.v-menu__content {
  margin: 10px 0 10px 0 !important;
}

.v-picker {
  box-shadow: 0 15px 40px -10px var(--v-box-shadow-base);
}

::v-deep .v-date-picker-years li:hover, ::v-deep .v-date-picker-table--month .v-btn:hover {
  background-color: var(--v-menu-hover-base) !important;
}
</style>
