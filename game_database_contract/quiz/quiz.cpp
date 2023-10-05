#include "quiz.hpp"

//----------Question actions-------------
[[inery::action]]
void quiz::insertq(std::string question, std::vector<std::string> answers){
    require_auth(get_self());

    check(!question.empty(), "question must not be empty");

    check(answers.size() >= 4, "you need to provide at least four answer");

    _questions.emplace(get_self(), [&](auto& row){
        row.question_id = _questions.available_primary_key();
        row.question    = question;
        row.answers     = answers;
    });
}

[[inery::action]]
void quiz::updateq(uint64_t question_id, std::string question, std::vector<std::string> answers){
    require_auth(get_self());

    auto question_itr = _questions.find(question_id);

    check(question_itr != _questions.end(), "question with that id doesn't exist");

    check(!question.empty(), "question must not be empty");

    check(answers.size() >= 4, "you need to provide at least four(4) answers");
    
    _questions.modify(question_itr, get_self(), [&](auto& row){
        row.question = question;
        row.answers  = answers;
    });
}

[[inery::action]]
void quiz::deleteq(uint64_t question_id){
    require_auth(get_self());

    auto question_itr = _questions.find(question_id);

    check(question_itr != _questions.end(), "question with that id doesn't exist");

    _questions.erase(question_itr);
}

//----------Answer actions-------------
[[inery::action]]
void quiz::updatea(uint64_t question_id, std::vector<std::string> answers){
    require_auth(get_self());
    
    auto question_itr = _questions.find(question_id);

    check(question_itr != _questions.end(),"question with that id doesn't exist");

    check(answers.size() >= 4, "you need to provide at least four(4) answers");

    _questions.modify(question_itr, get_self(), [&](auto& row){
        row.answers = answers;
    });
}

[[inery::action]]
void quiz::inserta(uint64_t question_id, std::string answer){
    require_auth(get_self());

    auto question_itr = _questions.find(question_id);

    check(question_itr != _questions.end(), "question with that id doesn't exist");

    check(!answer.empty(), "answer must not be empty");

    _questions.modify(question_itr, get_self(), [&](auto& row){
        auto it = std::find(row.answers.begin(), row.answers.end(), answer);    
        check(it == row.answers.end(), "this answer already exist");
        row.answers.emplace_back(answer);
    });
}

[[inery::action]]
void quiz::deletea(uint64_t question_id, std::string answer){
    require_auth(get_self());

    auto question_itr = _questions.find(question_id);

    check(question_itr != _questions.end(), "question with that id doesn't exist");

    check(!answer.empty(), "answer must not be empty");

    _questions.modify(question_itr, get_self(), [&](auto& row){
        auto it = std::find(row.answers.begin(), row.answers.end(), answer);    
        check(it < row.answers.end(), "the answer doesn't exist");
        row.answers.erase(it, it + 1);
    });
}

//----------User actions-------------
[[inery::action]]
void quiz::insertu(name username, std::string email, std::string password){
    require_auth(get_self());

    auto usernames = _users.get_index<"username"_n>();
    auto user = usernames.find(username.value);

    check(user == usernames.end() , "user already exists.");
    
    check(!password.empty(), "password must not be empty");

    _users.emplace(get_self(), [&](auto& row){
        row.user_id     = _users.available_primary_key();
        row.max_score   = 0;
        row.username    = username;
        row.email       = email;
        row.password    = password;
    });
}

[[inery::action]]
void quiz::updateu(uint64_t user_id, name username, std::string email, std::string password){
    require_auth(get_self());

    auto users_itr = _users.find(user_id);

    check(users_itr != _users.end(), "user with that id doesn't exist");

    check(!password.empty(), "password must not be empty");
    
    _users.modify(users_itr, get_self(), [&](auto& row){
        row.username    = username;
        row.email       = email;
        row.password    = password;
    });
}

[[inery::action]]
void quiz::deleteu(uint64_t user_id){
    require_auth(get_self());

    auto users_itr = _users.find(user_id);

    check(users_itr != _users.end(), "user with that id doesn't exist");

    _users.erase(users_itr);
}

//----------Max score action-------------
[[inery::action]]
void quiz::updatem(uint64_t user_id, uint64_t score){
    require_auth(get_self());

    auto users_itr = _users.find(user_id);

    check(users_itr != _users.end(), "user with that id doesn't exist");

    _users.modify(users_itr, get_self(), [&](auto& row){
        check(row.max_score < score, "this is not the new personal high-score");
        row.max_score = score;
    });
}

//highscores actions
[[inery::action]] 
void quiz::inserts(name username, uint64_t score) {
    require_auth(get_self());

    std::vector<std::pair<name, uint64_t>> temp_storage;
    
    auto entry_stored = _gamedata.get_or_create(get_self(), gamerow);
    entry_stored.high_scores.push_back(std::make_pair(username, score));

    auto compareBySecond = [](const std::pair<name, uint64_t>& a, const std::pair<name, uint64_t>& b) {
        return a.second > b.second;
    };

    std::sort(entry_stored.high_scores.begin(), entry_stored.high_scores.end(), compareBySecond);

    uint64_t dist = distance(entry_stored.high_scores.begin(), entry_stored.high_scores.end());
    
    if(dist > 10){
        entry_stored.high_scores.pop_back();
    }

    _gamedata.set(entry_stored, get_self());
}

//since this is not needed we wont dispatch it, if needed uncomment in dispatch section
[[inery::action]] 
void quiz::deletes() {
    require_auth(get_self());

    std::vector<std::pair<name, uint64_t>> temp_storage;
    
    auto entry_stored = _gamedata.get_or_create(get_self(), gamerow);
    entry_stored.high_scores.clear();

    entry_stored.high_scores.push_back(std::make_pair("none"_n, 0));
    
    _gamedata.set(entry_stored, get_self());
}


//----------Total played actions-------------
[[inery::action]] 
void quiz::inc() {
    require_auth(get_self());

    auto entry_stored = _gamedata.get_or_create(get_self(), gamerow);
    entry_stored.total_games_played += 1;
    _gamedata.set(entry_stored, get_self());
}

[[inery::action]] 
void quiz::set(uint64_t value) {
    require_auth(get_self());

    auto entry_stored = _gamedata.get_or_create(get_self(), gamerow);
    entry_stored.total_games_played = value;
    _gamedata.set(entry_stored, get_self());
}

[[inery::action]] 
void quiz::get() {
    if (_gamedata.exists())
       inery::print("Value stored for: ", _gamedata.get().total_games_played, "\n");
    else
       inery::print("Singleton is empty\n");
}

INERY_DISPATCH(quiz, (insertq)(updateq)(deleteq) (insertu)(updateu)(deleteu) (inserta)(deletea)(updatea) (updatem) (get)(set)(inc) (inserts)/*(deletes)*/);
