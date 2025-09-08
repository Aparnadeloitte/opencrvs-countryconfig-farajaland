/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors located at https://github.com/opencrvs/opencrvs-core/blob/master/AUTHORS.
 */

import {
  AddressType,
  and,
  ConditionalType,
  defineFormPage,
  FieldType,
  PageTypes,
  field
} from '@opencrvs/toolkit/events'
import { or, not, never } from '@opencrvs/toolkit/conditionals'
import { emptyMessage } from '@countryconfig/form/v2/utils'
import {
  invalidNameValidator,
  nationalIdValidator,
  MAX_NAME_LENGTH
} from '@countryconfig/form/v2/birth/validators'
import { InformantType } from './informant'
import { IdType, idTypeOptions } from '../../../person'
import {
  educationalAttainmentOptions,
  maritalStatusOptions
} from '../../../../common/select-options'

export const requireFatherDetails = or(
  field('father.detailsNotAvailable').isFalsy(),
  field('informant.relation').isEqualTo(InformantType.FATHER)
)
const PHONE_NUMBER_REGEX = '^0(7|9)[0-9]{8}$'

export const father = defineFormPage({
  id: 'father',
  type: PageTypes.enum.FORM,
  title: {
    defaultMessage: "Father's details",
    description: 'Form section title for fathers details',
    id: 'v2.form.section.father.title'
  },
  fields: [
    {
      id: 'father.detailsNotAvailable',
      type: FieldType.CHECKBOX,
      defaultValue: false,
      label: {
        defaultMessage: "Father's details are not available",
        description: 'This is the label for the field',
        id: 'event.birth.action.declare.form.section.father.field.detailsNotAvailable.label'
      }
    },
    {
      id: 'father.reason',
      type: FieldType.TEXT,
      required: true,
      label: {
        defaultMessage: 'Reason',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.father.field.reason.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(field('father.detailsNotAvailable').isEqualTo(true))
        }
      ]
    },
    {
      id: 'father.details.divider',
      type: FieldType.DIVIDER,
      label: emptyMessage,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: field('father.detailsNotAvailable').isFalsy()
        }
      ]
    },
    {
      id: 'father.name',
      type: FieldType.NAME,
      required: true,
      configuration: { maxLength: MAX_NAME_LENGTH },
      hideLabel: true,
      label: {
        defaultMessage: "Father's name",
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.father.field.name.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(field('father.detailsNotAvailable').isEqualTo(false))
        }
      ],
      validation: [invalidNameValidator('father.name')]
    },
    {
      id: 'father.surname',
      type: FieldType.TEXT,
      required: true,
      configuration: { maxLength: MAX_NAME_LENGTH },
      label: {
        defaultMessage: "Father's surname",
        description: 'This is the label for the field surname',
        id: 'v2.event.birth.action.declare.form.section.father.field.surname.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(field('father.detailsNotAvailable').isEqualTo(false))
        }
      ]
    },
    {
      id: 'father.dob',
      type: 'DATE',
      required: true,
      secured: true,
      validation: [
        {
          message: {
            defaultMessage: 'Must be a valid birth date',
            description: 'This is the error message for invalid date',
            id: 'v2.event.birth.action.declare.form.section.person.field.dob.error'
          },
          validator: field('father.dob').isBefore().now()
        },
        {
          message: {
            defaultMessage: "Birth date must be before child's birth date",
            description:
              "This is the error message for a birth date after child's birth date",
            id: 'v2.event.birth.action.declare.form.section.person.dob.afterChild'
          },
          validator: field('father.dob').isBefore().date(field('child.dob'))
        }
      ],
      label: {
        defaultMessage: 'Date of birth',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.person.field.dob.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            not(field('father.dobUnknown').isEqualTo(true)),
            requireFatherDetails,
            field('father.detailsNotAvailable').isEqualTo(false)
          )
        }
      ]
    },
    {
      id: 'father.dobUnknown',
      type: FieldType.CHECKBOX,
      label: {
        defaultMessage: 'Exact date of birth unknown',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.person.field.age.checkbox.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            requireFatherDetails,
            field('father.detailsNotAvailable').isEqualTo(false)
          )
        },
        {
          type: ConditionalType.DISPLAY_ON_REVIEW,
          conditional: never()
        }
      ]
    },
    {
      id: 'father.age',
      type: FieldType.TEXT,
      required: true,
      label: {
        defaultMessage: 'Age in years',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.father.field.age.label'
      },
      configuration: {
        postfix: {
          defaultMessage: 'years',
          description: 'This is the postfix for age field',
          id: 'v2.event.birth.action.declare.form.section.person.field.age.postfix'
        }
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            field('father.dobUnknown').isEqualTo(true),
            requireFatherDetails,
            field('father.detailsNotAvailable').isEqualTo(false)
          )
        }
      ]
    },
    {
      id: 'father.placeOfBirth',
      type: FieldType.TEXT,
      required: false,
      secured: true,
      configuration: { maxLength: MAX_NAME_LENGTH },
      label: {
        defaultMessage: "Father's place of birth",
        description: 'This is the label for the field place of birth',
        id: 'v2.event.birth.action.declare.form.section.father.field.placeOfBirth.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(field('father.detailsNotAvailable').isEqualTo(false))
        }
      ]
    },
    {
      id: 'father.nationality',
      type: FieldType.COUNTRY,
      required: true,
      label: {
        defaultMessage: 'Nationality',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.person.field.nationality.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            requireFatherDetails,
            field('father.detailsNotAvailable').isEqualTo(false)
          )
        }
      ],
      defaultValue: 'COK'
    },
    {
      id: 'father.idType',
      type: FieldType.SELECT,
      required: true,
      label: {
        defaultMessage: 'Type of ID',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.person.field.idType.label'
      },
      options: idTypeOptions,
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            requireFatherDetails,
            field('father.detailsNotAvailable').isEqualTo(false)
          )
        }
      ]
    },
    {
      id: 'father.passport',
      type: FieldType.TEXT,
      required: true,
      label: {
        defaultMessage: 'ID Number',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.person.field.passport.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            field('father.idType').isEqualTo(IdType.PASSPORT),
            requireFatherDetails,
            field('father.detailsNotAvailable').isEqualTo(false)
          )
        }
      ]
    },
    {
      id: 'father.brn',
      type: FieldType.TEXT,
      required: true,
      label: {
        defaultMessage: 'ID Number',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.person.field.bc.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            field('father.idType').isEqualTo(IdType.BIRTH_CERTIFICATE),
            requireFatherDetails,
            field('father.detailsNotAvailable').isEqualTo(false)
          )
        }
      ]
    },
    {
      id: 'father.address',
      type: FieldType.ADDRESS,
      secured: true,
      hideLabel: true,
      label: {
        defaultMessage: 'Usual place of residence',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.person.field.address.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            field('father.detailsNotAvailable').isEqualTo(false),
            requireFatherDetails
          )
        }
      ],
      defaultValue: {
        country: 'COK',
        addressType: AddressType.DOMESTIC,
        province: '$user.province',
        district: '$user.district',
        urbanOrRural: 'URBAN'
      }
    },
    {
      id: 'father.phoneNo',
      type: FieldType.PHONE,
      required: false,
      secured: true,
      label: {
        defaultMessage: 'Phone number',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.father.field.phoneNo.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            field('father.detailsNotAvailable').isEqualTo(false),
            requireFatherDetails
          )
        }
      ],
      validation: [
        {
          message: {
            defaultMessage:
              'Must be a valid 10 digit number that starts with 0(7|9)',
            description:
              'The error message that appears on phone numbers where the first two characters must be 07 or 09, and length must be 10',
            id: 'v2.event.birth.action.declare.form.section.father.field.phoneNo.error'
          },
          validator: or(
            field('father.phoneNo').matches(PHONE_NUMBER_REGEX),
            field('father.phoneNo').isFalsy()
          )
        }
      ]
    },
    {
      id: 'father.email',
      type: FieldType.EMAIL,
      required: false,
      secured: true,
      label: {
        defaultMessage: 'Email',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.father.field.email.label'
      },
      configuration: {
        maxLength: 255
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(
            field('father.detailsNotAvailable').isEqualTo(false),
            requireFatherDetails
          )
        }
      ]
    },
    {
      id: 'father.occupation',
      type: FieldType.TEXT,
      required: false,
      label: {
        defaultMessage: 'Occupation',
        description: 'This is the label for the field',
        id: 'v2.event.birth.action.declare.form.section.father.field.occupation.label'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: and(field('father.detailsNotAvailable').isEqualTo(false))
        }
      ]
    }
  ]
})
