import 'dart:convert';

import '../api/api_client.dart';

String _s(dynamic v) => v?.toString() ?? '';
List<Map<String, dynamic>> _maps(dynamic v) =>
    (v as List? ?? []).cast<Map<String, dynamic>>();

class K12Option {
  final String id;
  final String label;
  final String detail;
  const K12Option(this.id, this.label, [this.detail = '']);
}

/// Grades, subjects, states, explanation styles and levels.
class K12Meta {
  final List<K12Option> grades;
  final List<K12Option> subjects; // detail = framework short name
  final List<K12Option> states; // id = postal code
  final List<K12Option> styles;
  final List<K12Option> tiers;

  const K12Meta(
      this.grades, this.subjects, this.states, this.styles, this.tiers);

  factory K12Meta.fromJson(Map<String, dynamic> j) => K12Meta(
        _maps(j['grades']).map((g) => K12Option(_s(g['id']), _s(g['label']))).toList(),
        _maps(j['subjects'])
            .map((s) => K12Option(_s(s['id']), _s(s['label']), _s(s['short'])))
            .toList(),
        _maps(j['states'])
            .map((s) => K12Option(_s(s['code']), _s(s['name'])))
            .toList(),
        _maps(j['styles']).map((s) => K12Option(_s(s['id']), _s(s['label']))).toList(),
        _maps(j['tiers'])
            .map((t) => K12Option(_s(t['id']), _s(t['label']), _s(t['detail'])))
            .toList(),
      );

  String gradeLabel(String id) =>
      grades.firstWhere((g) => g.id == id, orElse: () => K12Option(id, 'Grade $id')).label;
  String stateName(String code) =>
      states.firstWhere((s) => s.id == code, orElse: () => K12Option(code, code)).label;
  String subjectLabel(String id) =>
      subjects.firstWhere((s) => s.id == id, orElse: () => K12Option(id, id)).label;
}

/// A learner profile under the parent's account.
class K12Learner {
  final String id;
  final String nickname;
  final String grade;
  final String state;
  const K12Learner(this.id, this.nickname, this.grade, this.state);

  factory K12Learner.fromJson(Map<String, dynamic> j) => K12Learner(
      _s(j['learnerId']), _s(j['nickname']), _s(j['grade']), _s(j['state']));
}

class K12Skill {
  final String id;
  final String code;
  final String name;
  final List<String> standards;
  final bool fromState;
  const K12Skill(this.id, this.code, this.name, this.standards, this.fromState);

  factory K12Skill.fromJson(Map<String, dynamic> j) => K12Skill(
        _s(j['id']),
        _s(j['code']),
        _s(j['name']),
        (j['standards'] as List? ?? []).map(_s).toList(),
        j['source'] == 'state',
      );
}

class K12Domain {
  final String id;
  final String code;
  final String name;
  final String short;
  final String note;
  final bool fromState;
  final List<K12Skill> skills;
  const K12Domain(this.id, this.code, this.name, this.short, this.note,
      this.fromState, this.skills);

  factory K12Domain.fromJson(Map<String, dynamic> j) => K12Domain(
        _s(j['id']),
        _s(j['code']),
        _s(j['name']),
        _s(j['short']),
        _s(j['note']),
        j['source'] == 'state',
        _maps(j['skills']).map(K12Skill.fromJson).toList(),
      );
}

class K12Tree {
  final String subject;
  final String subjectLabel;
  final String gradeLabel;
  final String stateName;
  final String benchmark;
  final String stateFramework;
  final String family; // ccss | ngss | state
  final String alignmentNote;
  final List<K12Domain> domains;
  const K12Tree(this.subject, this.subjectLabel, this.gradeLabel, this.stateName,
      this.benchmark, this.stateFramework, this.family, this.alignmentNote,
      this.domains);

  factory K12Tree.fromJson(Map<String, dynamic> j) => K12Tree(
        _s(j['subject']),
        _s(j['subjectLabel']),
        _s(j['gradeLabel']),
        _s((j['state'] as Map<String, dynamic>?)?['name']),
        _s(j['benchmark']),
        _s(j['stateFramework']),
        _s(j['family']),
        _s(j['alignmentNote']),
        _maps(j['domains']).map(K12Domain.fromJson).toList(),
      );
}

/// A learner's progress on one skill.
class K12Progress {
  final String status; // practising | mastered | struggling
  final double? lastPct;
  final int sessions;
  final int quizzes;
  const K12Progress(this.status, this.lastPct, this.sessions, this.quizzes);

  factory K12Progress.fromJson(Map<String, dynamic> j) => K12Progress(
        _s(j['status']),
        (j['lastPct'] as num?)?.toDouble(),
        (j['sessions'] as num?)?.toInt() ?? 0,
        (j['quizzes'] as num?)?.toInt() ?? 0,
      );
}

class K12MicroSkill {
  final String title;
  final String code;
  const K12MicroSkill(this.title, this.code);
}

class K12Reply {
  final String text;
  final List<String> tags;
  const K12Reply(this.text, this.tags);
}

class K12Question {
  final String type; // mc | short
  final String question;
  final List<String> options;
  final int answerIndex; // mc
  final String answerText; // short (or the mc option)
  final String explanation;
  final int dok;
  final String dokLabel;
  final String code;
  const K12Question(this.type, this.question, this.options, this.answerIndex,
      this.answerText, this.explanation, this.dok, this.dokLabel, this.code);

  bool get isChoice => type == 'mc';

  factory K12Question.fromJson(Map<String, dynamic> j) {
    final options = (j['options'] as List? ?? []).map(_s).toList();
    final isChoice = j['type'] == 'mc';
    final index = isChoice ? (j['answer'] as num?)?.toInt() ?? 0 : -1;
    return K12Question(
      _s(j['type']),
      _s(j['question']),
      options,
      index,
      isChoice && index >= 0 && index < options.length ? options[index] : _s(j['answer']),
      _s(j['explanation']),
      (j['dok'] as num?)?.toInt() ?? 1,
      _s(j['dokLabel']),
      _s(j['code']),
    );
  }
}

class K12Quiz {
  final List<K12Question> questions;
  final String skillName;
  final String skillCode;
  final String domain;
  final String grade;
  final String state;
  final String subject;
  final String tier;
  final String stateFramework;
  const K12Quiz(this.questions, this.skillName, this.skillCode, this.domain,
      this.grade, this.state, this.subject, this.tier, this.stateFramework);

  factory K12Quiz.fromJson(Map<String, dynamic> j) {
    final skill = j['skill'] as Map<String, dynamic>? ?? {};
    final h = j['heading'] as Map<String, dynamic>? ?? {};
    return K12Quiz(
      _maps(j['questions']).map(K12Question.fromJson).toList(),
      _s(skill['name']),
      _s(skill['code']),
      _s(skill['domain']),
      _s(h['grade']),
      _s(h['state']),
      _s(h['subject']),
      _s(h['tier']),
      _s(h['stateFramework']),
    );
  }
}

class K12SkillRef {
  final String skillId;
  final String subject;
  final String name;
  final String domain;
  final String reason;
  final String status;
  final double? lastPct;
  const K12SkillRef(this.skillId, this.subject, this.name, this.domain,
      this.reason, this.status, this.lastPct);

  factory K12SkillRef.fromJson(Map<String, dynamic> j) => K12SkillRef(
        _s(j['skillId']),
        _s(j['subject']),
        _s(j['name']),
        _s(j['domain']),
        _s(j['reason']),
        _s(j['status']),
        (j['lastPct'] as num?)?.toDouble(),
      );
}

class K12Activity {
  final String kind; // learn | quiz | stuck
  final String name;
  final String subject;
  final int? score;
  final int? total;
  final DateTime? at;
  const K12Activity(this.kind, this.name, this.subject, this.score, this.total, this.at);

  factory K12Activity.fromJson(Map<String, dynamic> j) => K12Activity(
        _s(j['kind']),
        _s(j['name']),
        _s(j['subject']),
        (j['score'] as num?)?.toInt(),
        (j['total'] as num?)?.toInt(),
        DateTime.tryParse(_s(j['at']))?.toLocal(),
      );
}

class K12SubjectSummary {
  final int studied;
  final int mastered;
  final int struggling;
  const K12SubjectSummary(this.studied, this.mastered, this.struggling);
}

class K12Dashboard {
  final int weekSessions;
  final int weekQuizzes;
  final double? weekAveragePct;
  final List<K12SkillRef> weekSkills;
  final Map<String, K12SubjectSummary> subjects;
  final List<K12SkillRef> mastered;
  final List<K12SkillRef> struggling;
  final List<K12SkillRef> recommendations;
  final List<K12Activity> recent;
  const K12Dashboard(this.weekSessions, this.weekQuizzes, this.weekAveragePct,
      this.weekSkills, this.subjects, this.mastered, this.struggling,
      this.recommendations, this.recent);

  factory K12Dashboard.fromJson(Map<String, dynamic> j) {
    final week = j['week'] as Map<String, dynamic>? ?? {};
    final subjects = (j['subjects'] as Map<String, dynamic>? ?? {}).map((k, v) {
      final m = v as Map<String, dynamic>;
      return MapEntry(
          k,
          K12SubjectSummary((m['studied'] as num?)?.toInt() ?? 0,
              (m['mastered'] as num?)?.toInt() ?? 0, (m['struggling'] as num?)?.toInt() ?? 0));
    });
    return K12Dashboard(
      (week['sessions'] as num?)?.toInt() ?? 0,
      (week['quizzes'] as num?)?.toInt() ?? 0,
      (week['averagePct'] as num?)?.toDouble(),
      _maps(week['skills']).map(K12SkillRef.fromJson).toList(),
      subjects,
      _maps(j['mastered']).map(K12SkillRef.fromJson).toList(),
      _maps(j['struggling']).map(K12SkillRef.fromJson).toList(),
      _maps(j['recommendations']).map(K12SkillRef.fromJson).toList(),
      _maps(j['recent']).map(K12Activity.fromJson).toList(),
    );
  }
}

/// US K–12 tutor — /api/k12.
class K12Service {
  static const _aiTimeout = Duration(seconds: 90);
  static K12Meta? _meta;

  static String _error(String body, String fallback) {
    try {
      return (jsonDecode(body) as Map<String, dynamic>)['error'] as String? ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  static Future<Map<String, dynamic>> _get(Map<String, String> query, String fallback) async {
    final r = await ApiClient.get('k12', query);
    if (r.statusCode != 200) throw Exception(_error(r.body, fallback));
    return jsonDecode(r.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> _post(Map<String, dynamic> body, String fallback,
      {bool ai = false}) async {
    final r = await ApiClient.post('k12', jsonEncode(body), timeout: ai ? _aiTimeout : null);
    if (r.statusCode != 200) throw Exception(_error(r.body, fallback));
    return jsonDecode(r.body) as Map<String, dynamic>;
  }

  static Future<K12Meta> meta() async =>
      _meta ??= K12Meta.fromJson(await _get({'op': 'meta'}, 'Could not load the US curriculum.'));

  static Future<List<K12Learner>> learners() async =>
      _maps((await _get({'op': 'learners'}, 'Could not load your learners.'))['learners'])
          .map(K12Learner.fromJson)
          .toList();

  static Future<K12Learner> saveLearner(
          {String? id, required String nickname, required String grade, required String state}) async =>
      K12Learner.fromJson((await _post({
        'op': 'saveLearner',
        if (id != null) 'learnerId': id,
        'nickname': nickname,
        'grade': grade,
        'state': state,
      }, 'Could not save the learner.'))['learner'] as Map<String, dynamic>);

  static Future<void> deleteLearner(String id) =>
      _post({'op': 'deleteLearner', 'learnerId': id}, 'Could not remove the learner.');

  static Future<(K12Tree, Map<String, K12Progress>)> tree(String learnerId, String subject) async {
    final j = await _get({'op': 'tree', 'learnerId': learnerId, 'subject': subject},
        'Could not load the skill tree.');
    final progress = (j['progress'] as Map<String, dynamic>? ?? {})
        .map((k, v) => MapEntry(k, K12Progress.fromJson(v as Map<String, dynamic>)));
    return (K12Tree.fromJson(j['tree'] as Map<String, dynamic>), progress);
  }

  static Map<String, dynamic> _lesson(String learnerId, String subject, String skillId,
          {String micro = '', String style = '', String tier = ''}) =>
      {
        'learnerId': learnerId,
        'subject': subject,
        'skillId': skillId,
        if (micro.isNotEmpty) 'micro': micro,
        if (style.isNotEmpty) 'style': style,
        if (tier.isNotEmpty) 'tier': tier,
      };

  static Future<List<K12MicroSkill>> microSkills(
      String learnerId, String subject, String skillId) async {
    final j = await _post({'op': 'microskills', ..._lesson(learnerId, subject, skillId)},
        'Could not break this skill down.', ai: true);
    return _maps(j['microSkills']).map((m) => K12MicroSkill(_s(m['title']), _s(m['code']))).toList();
  }

  /// The tutor's next message. [turns] excludes the hidden opening prompt.
  static Future<K12Reply> learn(String learnerId, String subject, String skillId,
      {required String micro,
      required String style,
      required String tier,
      required List<Map<String, String>> turns}) async {
    final j = await _post({
      'op': 'learn',
      ..._lesson(learnerId, subject, skillId, micro: micro, style: style, tier: tier),
      'turns': turns,
    }, 'The tutor is unavailable. Please try again.', ai: true);
    return K12Reply(_s(j['text']), (j['tags'] as List? ?? []).map(_s).toList());
  }

  static Future<K12Quiz> quiz(String learnerId, String subject, String skillId,
          {required String micro, required String tier, bool worksheet = false}) async =>
      K12Quiz.fromJson(await _post({
        'op': 'quiz',
        ..._lesson(learnerId, subject, skillId, micro: micro, tier: tier),
        'worksheet': worksheet,
      }, 'Could not write the questions. Please try again.', ai: true));

  /// Saves a quiz score; returns the skill's new status.
  static Future<String> quizResult(String learnerId, String subject, String skillId,
          {required String tier, required int score, required int total}) async =>
      _s((await _post({
        'op': 'quizResult',
        ..._lesson(learnerId, subject, skillId, tier: tier),
        'score': score,
        'total': total,
      }, 'Could not save the score.'))['status']);

  static Future<void> stuck(String learnerId, String subject, String skillId) =>
      _post({'op': 'stuck', ..._lesson(learnerId, subject, skillId)}, 'Could not save.');

  static Future<K12Dashboard> dashboard(String learnerId) async => K12Dashboard.fromJson(
      await _get({'op': 'dashboard', 'learnerId': learnerId}, 'Could not load the dashboard.'));

  static Future<String> insights(String learnerId) async =>
      _s((await _post({'op': 'insights', 'learnerId': learnerId},
          'Insights are unavailable right now.', ai: true))['text']);
}
