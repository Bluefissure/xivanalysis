import {Trans} from '@lingui/react'
import {inject, observer} from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import {Checkbox, Label} from 'semantic-ui-react'

// Direct path import 'cus it'll be a dep loop otherwise
import {SEVERITY} from 'parser/core/modules/Suggestions/Suggestion'
import {SettingsStore} from 'store/settings'

import styles from './Suggestions.module.css'

const SEVERITY_LABEL_PROPS = {
	[SEVERITY.MORBID]: {content: 'Morbid', color: 'black', icon: 'times'},
	[SEVERITY.MAJOR]: {content: 'Major', color: 'red', icon: 'arrow up'},
	[SEVERITY.MEDIUM]: {content: 'Medium', color: 'orange'},
	[SEVERITY.MINOR]: {content: 'Minor', color: 'blue', icon: 'arrow down'},
}

@inject('settingsStore')
@observer
class Suggestions extends React.Component {
	static propTypes = {
		settingsStore: PropTypes.instanceOf(SettingsStore),
		suggestions: PropTypes.arrayOf(PropTypes.shape({
			icon: PropTypes.string.isRequired,
			content: PropTypes.node.isRequired,
			why: PropTypes.node.isRequired,
			severity: PropTypes.number.isRequired,
		})).isRequired,
	}

	onToggleShowMinor = (_, data) => {
		this.props.settingsStore.setShowMinorSuggestions(data.checked)
	}

	render() {
		const showMinor = this.props.settingsStore.showMinorSuggestions

		const suggestions = this.props.suggestions.filter(
			suggestion => showMinor || suggestion.severity !== SEVERITY.MINOR
		)

		const hasMinor = this.props.suggestions.some(suggestion => suggestion.severity === SEVERITY.MINOR)

		return <>
			{hasMinor && <Checkbox
				toggle
				label={<label><Trans id="core.suggestion.show-minor">Show minor</Trans></label>}
				defaultChecked={showMinor}
				onChange={this.onToggleShowMinor}
				className={styles.checkbox}
			/>}
			<div className={styles.items}>
				{suggestions.map((suggestion, index) => <div key={index} className={styles.item}>
					<img src={suggestion.icon} alt=""/>
					<div>
						{suggestion.content}
						<div className={styles.extra}>
							<Label horizontal {...SEVERITY_LABEL_PROPS[suggestion.severity]} />
							{suggestion.why}
						</div>
					</div>
				</div>)}
				{suggestions.length === 0 && <div className={styles.item}>
					<div>
						<strong><Trans id="core.suggestion.nothing">There's nothing here!</Trans></strong><br/>
						{hasMinor && <Trans id="core.suggestion.nothing-but-minor">You can check over the minor suggestions by flicking the "Show minor" switch in the top right.</Trans>}
					</div>
				</div>}
			</div>
		</>
	}
}

export default Suggestions
