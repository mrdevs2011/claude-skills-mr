# Nima buzilgan edi

`mcp.js` (asl fayl) `http.createServer(...).listen(PORT)` bilan yozilgan —
bu doim ishlab turadigan, alohida process talab qiladigan oddiy Node server.
Vercel esa serverless: u faqat `/api` papkasidagi funksiyalarni ishga
tushiradi, `.listen()` chaqiradigan kodni umuman ishlatmaydi.

Loyihada `/api` papka va `vercel.json` bo'lmagani uchun Vercel butun
repo'ni statik sayt sifatida ko'rgan — faqat `index.html` ishlagan,
`/mcp`, `/register`, `/authorize`, `/.well-known/...` kabi yo'llarning
barchasi 404 qaytargan (yoki JSON o'rniga HTML). Claude connector
qo'shayotganda aynan shu yo'llarga so'rov yuboradi — shuning uchun
"Couldn't register with sign-in service" xatosi chiqqan.

# Nima o'zgartirildi

- `mcp.js`dagi barcha logika endi `api/index.js`da — `http.createServer`
  o'rniga oddiy `export default async function handler(req, res)`.
  Bu Vercel serverless funksiyasining standart shakli.
- `vercel.json` qo'shildi: `/mcp`, `/register`, `/authorize`, `/token`,
  `/health`, ikkita `/.well-known/...` yo'li — barchasi shu bitta
  funksiyaga yo'naltiriladi (`rewrites`). `index.html` esa statik holicha
  qoladi, o'sha yo'llarga tegmaydi.
- `vercel.json`da `functions.api/index.js.includeFiles: "instruction.md"`
  qo'shildi — aks holda Vercel `instruction.md`ni funksiya paketiga
  qo'shmaydi (chunki u kodda `import` qilinmagan, faylda runtime'da
  o'qiladi), va `get_instructions` doim xato qaytargan bo'lardi.
- `token.md`, `instruction.md` o'zgarishsiz qoldi.

# Claude sozlamalari (global "Instructions for Claude")

Bu server o'zi hech narsani majburlay olmaydi — Claude'ni har safar
`get_instructions`ni chaqirishga undaydigan narsa Claude.ai'ning
**Settings → Account → Instructions for Claude** maydonidagi matn (bu
matn repo'da emas, Claude tomonida saqlanadi, shuning uchun shu yerda
zaxira sifatida yozib qo'yamiz):

```
Siz MCP Hub nomli connector ulangan bo'lsangiz, shu connectorga ulanib
birinchi navbatda get_instructions ni o'qib chiqishingiz kerak va shu
yerda aytilgan ishlarni qilasiz!
```

Eslatma: bu matn faqat "MCP Hub" nomli gateway orqali ulangan holatni
nazarda tutadi. Agar bu server (`claude-skills-mr` / `instructions-mcp`)
to'g'ridan-to'g'ri, hub'siz ulangan bo'lsa, tool nomi oddiy
`get_instructions` bo'ladi (prefixsiz) — `instruction.md`dagi "Tool
nomlari haqida" bo'limi ikkala holatni ham aniqlab beradi, shuning uchun
matnni o'zgartirish shart emas. Faqat ikkalasi ham qamrab olinishini
xohlasang, shu matnni shunga almashtirish mumkin:

```
Har suhbat boshida: agar sizda get_instructions (yoki
hub__get_instructions kabi prefixli) nomli tool mavjud bo'lsa, birinchi
navbatda shuni chaqiring va u qaytargan qoidalarga to'liq amal qiling.
```

# Skill tizimi (list_skills / get_skill)

`instruction.md` endi faqat **router** — kichik va qisqa. Mavzuga oid
batafsil qoidalar (masalan, kod yozishda xatolik chiqsa nima qilish kerak)
`skills/` papkasidagi alohida `.md` fayllarda, papka bo'yicha guruhlangan:

```
skills/
  coding/
    GeneralDebuggingProcessWhenCodeErrorsOrBreaks.md        # umumiy debug tartibi (meta-skill)
    StayScopedToRequestedTaskAvoidUnrequestedChanges.md     # umumiy "vazifaga aniq qolish" (meta-skill)
    HallucinatedMethodOrPropertyIsNotAFunctionTypeError.md  # AI o'ylab topgan metod
    ReferenceErrorXIsNotDefinedMissingImportOrTypo.md       # import yo'q / typo
    WrongDataShapeAssumptionSilentWrongResultOrCrash.md     # noto'g'ri data shape taxmini
    vercel/
      VercelListenInsteadOfHandlerExportCauses404OnAllRoutes.md
      VercelCustomRouteNotMatchingApiFilenameReturns404MissingRewrites.md
      VercelRuntimeReadFileEnoentMissingIncludeFilesConfig.md
      VercelEntireProjectServedAsStaticSiteMissingApiOrVercelJson.md
      VercelEnvVarUndefinedAtRuntimeLocalEnvWorks.md         # env lokalda bor, Vercel'da undefined
    async/
      AsyncFunctionReturnsPendingPromiseInsteadOfValueMissingAwait.md
      ArrayMapWithAsyncCallbackReturnsPromiseArrayNotValues.md
      UnhandledPromiseRejectionCrashMissingTryCatchAroundAwait.md
      AsyncRaceConditionDependentTasksStartedInParallelWithPromiseAll.md
      ForgotToAwaitInMapForEachOrThenChain.md               # map/forEach ichida await unutilgan
      RaceConditionSharedStateWithoutLockOrQueue.md         # shared state parallel o'zgaradi
      AsyncFunctionNotMarkedAsyncButUsesAwait.md            # await bor, async yo'q
      FloatingPromiseNotAwaitedOrReturned.md                # floating promise — chaqirilgan, kutulmagan
      ThenWithoutCatchOrFinallyResourceLeak.md              # .then bor, .catch/finally yo'q
      AsyncErrorInFireAndForgetNotLogged.md                 # fire-and-forget xatosi log qilinmagan
      PromiseAllSettledNeededButUsedAll.md                  # all o'rniga allSettled kerak edi
      AwaitInLoopSequentialWhenParallelPossible.md          # loop ichida await — parallel mumkin edi
      MissingAbortControllerForFetchCancellation.md         # fetch bekor qilinmagan (AbortController)
      UsedTimeSleepInAsyncFunctionBlockingEventLoopInsteadOfAsyncioSleep.md  # time.sleep async da event loop bloklaydi
    null/
      CannotReadPropertiesOfUndefinedOrNullTypeErrorDiagnosis.md
      FalsyZeroOrEmptyStringWronglyTreatedAsMissingValueBug.md
    patterns/
      PythonMutableDefaultArgumentInFunctionSignatureCausesSharedStateAcrossCalls.md  # mutable default arg shared state
      DeeplyNestedConditionalsInsteadOfEarlyReturnGuardClauses.md  # nested if o'rniga early return
      HardcodedMagicNumbersOrStringsScatteredInsteadOfNamedConstants.md  # magic number/string o'rniga named constant
      PythonOpenWithoutWithOrContextManagerCausesFileDescriptorLeak.md  # open() without with — file descriptor leak
      HardcodedFilePathsInsteadOfUsingPathlibOrOsPathJoinForPortability.md  # hardcoded path o'rniga pathlib/os.path.join
      UsedManualIndexCounterInsteadOfEnumerateInPythonLoop.md  # qo'lda i += 1 o'rniga enumerate
      PythonRepeatedStringConcatenationInLoopInsteadOfListAppendThenJoin.md  # loop ichida string += o'rniga list + join
      UsedInListMembershipCheckInLoopInsteadOfSetForO1Lookup.md  # loop ichida list in check o'rniga set O(1)
      PythonBareExceptCatchesEverythingIncludingSystemExitAndKeyboardInterrupt.md  # bare except: SystemExit/KeyboardInterrupt ham yutiladi
      PythonExceptPassSilentlySwallowsErrorsWithoutLoggingOrReraising.md  # except: pass — xato jim yutiladi, log/re-raise yo'q
      UnquotedShellVariableInCommandCausesWordSplittingOrGlobExpansion.md  # qo'shtirnoqsiz $var — word splitting yoki glob expansion
      UsedForLoopWithAppendForSimpleListTransformationInsteadOfListComprehension.md  # oddiy list transform uchun for+append o'rniga list comprehension
      UsedNestedTernaryOperatorsInsteadOfClearIfElseOrHelperForComplexConditions.md  # nested ternary o'rniga aniq if-else yoki helper
      PythonUsedIsOperatorForValueEqualityCheckInsteadOfEquals.md  # qiymat solishtirishda is o'rniga ==
      PythonUsedEqualityOperatorToCheckNoneInsteadOfIsOperator.md  # None tekshiruvida == o'rniga is ishlatish
      PythonUsedFloatForMoneyOrCurrencyCalculationsInsteadOfDecimalCausingPrecisionLoss.md  # pul hisobida float o'rniga Decimal
      PythonUsedPrintStatementsForLoggingInsteadOfLoggingModule.md  # print() o'rniga logging moduli — daraja va boshqaruv
    react/
      ReactDirectStateMutationDoesNotTriggerRerender.md     # state'ni to'g'ridan-to'g'ri mutate
      ReactMissingKeyPropInListCausesWrongUpdate.md         # ro'yxatda key yo'q yoki indeks
      ReactUseEffectMissingOrWrongDependencyArray.md        # useEffect deps noto'g'ri / yo'q
      ReactStaleClosureInEventHandlerOrCallback.md          # stale closure handler/callback'da
      ReactStateUpdateDuringRenderOrWrongPhase.md           # render paytida setState / side-effect
      ReactConditionalHookCallBreaksRulesOfHooks.md         # hook if/loop/return ichida
      ReactKeyUsingIndexWhenListCanReorder.md               # key={index} reorder da xavfli
      ReactUncontrolledToControlledInputWarning.md          # uncontrolled → controlled input
      ReactForgotCleanupInUseEffectSubscription.md          # useEffect cleanup unutilgan
      ReactUsedUseEffectToSynchronizeDerivedStateInsteadOfComputingDuringRender.md  # derived state useEffect o'rniga render'da hisoblash
    deps/
      PackageUsedButNotInstalledOrNotInPackageJson.md       # paket ishlatilgan, lekin install qilinmagan
      WrongPackageVersionOrPeerDependencyConflict.md        # noto'g'ri versiya / peer conflict
      ImportPathWrongOrCaseSensitiveMismatch.md             # import yo'li / case mismatch (Linux)
      ForgotToAddTypesPackageForTypeScript.md               # @types paketi o'rnatilmagan
    logic/
      InvertedConditionOrWrongBooleanCausesOppositeBehavior.md  # teskari shart, jim noto'g'ri natija
      UsedWrongVariableOrShadowedNameSilentBug.md               # noto'g'ri o'zgaruvchi / shadowing
      OffByOneErrorInLoopIndexOrSlice.md                        # off-by-one loop/slice
      EmptyCatchOrSwallowedErrorHidesRealProblem.md             # bo'sh catch — xatoni yutish
      ComparedWithEqualsWhenStrictOrTypeCoercionBug.md          # == vs === tip majburlash
      TruthyCheckTreatsValidFalsyAsMissing.md                   # if(value) / || 0 va "" ni yo'qotadi
      MutatedInputArgumentOrSharedObjectUnexpectedly.md         # argument/shared obyektni mutate
      StringConcatInsteadOfTemplateOrNumberCoercion.md          # + bilan string concat / raqam chalkashuvi
      IncorrectNullishVsFalsyChoiceLeadsToWrongDefault.md       # ?? vs || noto'g'ri default
      ArrayMethodOnNonArrayOrUndefined.md                       # .map/.filter non-array da
      LoopVariableClosureCaptureWrongValue.md                   # loop o'zgaruvchisi closure'da
      ObjectReferenceEqualityInsteadOfDeepCompare.md            # obyekt === referens, qiymat emas
      DivisionByZeroOrModuloWithoutGuard.md                     # 0 ga bo'lish / modulo guard yo'q
      InfiniteLoopMissingTerminationCondition.md                # cheksiz loop — to'xtash sharti yo'q
      TypeCoercionInComparisonOrArithmeticUnexpected.md         # tip majburlash solishtirish/arifmetikada
      DateTimezoneNaiveComparisonBug.md                         # sana timezone e'tiborsiz
      RegexCatastrophicBacktrackingOrWrongPattern.md            # regex noto'g'ri / catastrophic backtracking
      NaNPropagatesSilentlyFromInvalidNumberParse.md            # NaN parse dan jim tarqaladi
      WrongOperatorPrecedenceOrMissingParentheses.md            # operator precedence / qavs yo'q
      ShallowCopyWhenDeepCopyNeeded.md                          # shallow copy — deep kerak edi
      FloatingPointPrecisionComparisonBug.md                    # floating point === solishtirish
      StringIndexOutOfBoundsOrSliceBeyondLength.md              # indeks/slice chegaradan tashqari
      NestedObjectPropertyAccessWithoutOptionalChainingThrowsOnUndefined.md  # nested property optional chaining yo'q
    refactor/
      ChangedSignatureOrTypeForgotToUpdateCallSites.md      # signature o'zgardi, call site qoldi
      RepeatedlyCopiedSimilarCodeBlocksInsteadOfExtractingReusableFunction.md  # o'xshash kod bloklari qayta yozilgan, reusable funksiya ajratilmagan
    attention/
      FixedSymptomInsteadOfRootCause.md                     # simptom yashirildi, ildiz qoldi
      ClaimedFixedWithoutActuallyRunningOrVerifying.md      # tekshirmasdan "tuzatildi" deb aytish
      RewroteWorkingCodeUnrequestedWhileFixingSomethingElse.md  # ishlayotgan kodni so'ralmasdan qayta yozish
      AnsweredDifferentQuestionThanAsked.md                 # so'ralgan savolga emas, boshqasiga javob
      HardcodedValueInsteadOfConfigOrParameter.md           # hardcode qilish (URL, kalit, limit)
      CopiedCodeWithoutAdaptingToExistingStyleOrContext.md  # kodni ko'chirib, uslubga moslashtirmaslik
      DidNotReadExistingCodeBeforeChanging.md               # mavjud kodni o'qimasdan o'zgartirish
      LeftDebugCodeOrTemporaryHackInFinalVersion.md         # debug/temporary kodni qoldirib ketish
      OverEngineeredSolutionWhenSimpleFixEnough.md          # oddiy joyda ortiqcha murakkablik
      IgnoredErrorFromPromiseOrCallbackSilently.md          # promise/callback xatosini e'tiborsiz qoldirish
      AssumedHappyPathOnlyNoEdgeCaseHandling.md             # faqat happy path, edge case yo'q
      ChangedTooManyFilesAtOnceWithoutClearPlan.md          # rejasiz ko'p faylni bir yo'la o'zgartirish
      DidNotCheckReturnValueOrStatusCode.md                 # return/status tekshirilmagan
      ReintroducedPreviouslyFixedBugWhileEditing.md         # avval tuzatilgan bug'ni qayta kiritish
      ToldUserToRunCommandWithoutExplainingWhyOrWhatItDoes.md # buyruq berish, tushuntirmaslik
      GaveIncompleteAnswerStoppedHalfway.md                 # javob yarim yo'lda to'xtagan
      SuggestedDeprecatedApiOrOutdatedPattern.md            # deprecated API / eskirgan pattern
      UsedPlaceholderOrFakeDataInProductionPath.md          # placeholder/fake data production yo'lida
      IgnoredUserConstraintsOrExplicitRequirements.md       # foydalanuvchi cheklovi e'tiborsiz
      CopiedStackOverflowAnswerWithoutUnderstanding.md      # SO/namuna kodni tushunmasdan ko'chirish
      DidNotVerifyFixAgainstOriginalErrorMessage.md         # tuzatishni asl xato bilan tekshirmaslik
      MixedTwoDifferentApproachesInOneSolution.md           # ikki xil yondashuvni aralashtirish
      AnsweredWithCodeThatDoesNotCompileOrRun.md            # berilgan kod ishga tushmaydi
      ProvidedSolutionForWrongLanguageOrFramework.md        # noto'g'ri til/framework da yechim
      IgnoredExistingTestsOrBrokeThemWithoutUpdating.md     # testlarni e'tiborsiz qoldirish/sindirish
    security/
      LoggedOrReturnedSecretOrSensitiveData.md              # maxfiy ma'lumotni log/qaytarish
      SqlStringConcatenationInjectionRisk.md                # SQL string concat — injection
      HardcodedSecretInSourceOrCommittedEnv.md              # secret kodda yoki commit qilingan .env
      EvalOrDynamicCodeExecutionFromUserInput.md            # eval/dynamic code user input dan
  agent-workflows/
    AgentAnsweredFactualOrCurrentEventQuestionFromMemoryWithoutCallingWebSearchOrRelevantTool.md  # faktual/yangi savolga esdan javob, web_search yoki tegishli tool chaqirilmagan
    AgentUsedGeneralWebSearchForLiveWeatherSportsOrStructuredDataWhenSpecializedToolAvailable.md  # ob-havo/sport uchun umumiy web_search o'rniga maxsus tool
    AgentUsedTokenInGitCloneUrlCommandLineRiskingExposureInProcessListOrHistory.md  # git clone URL ichida token command line da, process/history ochiq qolishi
    AddedNewSkillFileButForgotToUpdateReadmeStructureList.md   # yangi skill qo'shildi lekin README yangilanmadi
    AssumedToolCallSucceededWithoutCheckingOutputOrExitCode.md  # tool muvaffaqiyatini tekshirmasdan davom etish
    SequentialToolCallsWhenIndependentOperationsCouldBeParallelized.md  # mustaqil tool'larni ketma-ket qilish, parallel mumkin
    AgentWroteMathematicalOrTechnicalExpressionsAsPlainTextInsteadOfKaTeX.md  # matematik ifodalarni plain text yozish, KaTeX o'rniga
    EchoedOrLoggedSecretTokenInCommandOutputOrReport.md  # buyruq/log/hisobotda token yoki secret ochiq chiqarish
    AssumedFileContentStillMatchesEarlierReadWithoutRereadingBeforeMakingChanges.md  # eski fayl mazmunini taxmin qilib qayta o'qimasdan edit qilish
    AgentPreloadedEntireSkillsCatalogIntoContextInsteadOfQueryingSearchSkills.md  # butun skill katalogini context'ga yuklash, search_skills o'rniga
    CreatedSkillWithoutReadingArchitectureInstructionStyleGuidesFirst.md  # skill yaratishdan oldin qo'llanmalarni o'qimaslik
    PushedToRemoteMainWithoutPullingOrRebasingLatestFirst.md  # pushdan oldin pull/rebase qilmaslik, rejected push
    CreatedDuplicateSkillBecauseDidNotSearchExistingSkillsFirst.md  # yangi skill yaratishdan oldin mavjudlarni qidirmaslik, duplicate
    UsedEditFileOrReplaceWithoutReadingFileContentFirst.md  # edit_file ishlatishdan oldin faylni o'qimaslik, replace xato
    RepeatedSameToolCallWithIdenticalArgumentsInsteadOfReusingPriorResult.md  # bir xil tool argumentlari bilan qayta chaqirish, oldingi natijani ishlatmaslik
    CalledDependentToolsInSameParallelBatchCausingOrderOrRaceIssues.md  # bog'liq tool'larni parallel batchda chaqirish, tartib/race xato
    AssumedWorkingDirectoryWasCorrectWithoutVerifyingBeforeFileOrGitOperations.md  # ish papkasini tekshirmasdan file/git operatsiya
    DidNotCreateChecklistOrPlanForMultiStepTaskLeadingToForgottenSteps.md  # murakkab vazifada checklist/reja tuzmasdan boshlash, qadamlar unutiladi
    UsedGitAddDotWithoutReviewingStatusAndDiffIncludingUnintendedFiles.md  # git add . ishlatishdan oldin status/diff tekshirmaslik, noma'lum fayllar commitga tushadi
    AgentUsedBrowserAutomationForSimplePageContentWhenLightweightFetchToolSufficed.md  # oddiy sahifa uchun brauzer ishlatish, engil tool yetarli
    CreatedSkillWithMalformedFrontmatterOrMissingRequiredSections.md  # skill frontmatter noto'g'ri yoki majburiy bo'limlar yetishmaydi
    AddedNewSkillCategoryFolderButForgotToUpdateArchitectureMdCategoryList.md  # yangi kategoriya papkasi yaratilganda architecture.md yangilanmagan
    AgentWroteUserVisibleFilesToTmpOrHomeInsteadOfArtifactsWorkingDirectory.md  # foydalanuvchiga ko'rinadigan fayllarni /tmp yoki $HOME ga yozish, artifacts o'rniga
    AgentRanLongRunningCommandInForegroundWithoutBackgroundingOrTimeout.md  # uzoq buyruqni foreground'da ishga tushirish, session bloklash
    AgentOmittedRequiredRenderXmlElementsForCitationsCardsOrGeneratedFiles.md  # tool id berilgan bo'lsa-da render XML elementlari chiqarilmagan
    AgentEmittedRenderXmlWithNonexistentCitationIdOrCardId.md  # mavjud bo'lmagan citation_id yoki card_id bilan render XML chiqarish
    AgentUsedSearchConnectedToolsForBuiltInCapabilityInsteadOfDirectFunctionCall.md  # built-in tool uchun search_connected_tools ishlatish, to'g'ridan-to'g'ri call o'rniga
    AgentCalledCallConnectedToolWithGuessedArgumentsInsteadOfUsingSearchConnectedToolsForSchema.md  # call_connected_tool dan oldin search_connected_tools bilan schema olmaslik
    AgentReportedTaskCompleteWithoutIncludingRequiredFinalReportFields.md  # vazifa tugaganini aytish, lekin so'ralgan hisobot maydonlarini kiritmaslik
    AgentContinuedWorkflowAfterToolErrorWithoutAnalyzingFullErrorOutputFirst.md  # tool xatosidan keyin to'liq error matnini tahlil qilmasdan davom etish
    AgentWroteExecutableScriptOrCommandButDidNotExecuteItToConfirmCorrectness.md  # skript/buyruq yozdi lekin o'zi ishga tushirib tekshirmadi
    AgentAssumedFirstPageOfPaginatedResultsCompleteWithoutCheckingNextOrCursor.md  # paginated natijaning birinchi sahifasini to'liq deb taxmin qilish, keyingi sahifa/cursor tekshirilmagan
    AgentReportedSkillPushCompleteWithoutVerifyingCommitHashAndRemotePushOutput.md  # skill push hisobotida commit hash va push natijasini tekshirmasdan success deyish
    AgentDidNotVerifyAndCreateMissingDotEnvAndDotGitignoreBeforeCommitInSkillRepo.md  # skill repo setupida .env va .gitignore tekshirmasdan/yaratmasdan commit qilish
    AgentRespondedInWrongLanguageInsteadOfMatchingUserLanguageDialectAndAlphabet.md  # foydalanuvchi tiliga moslashmasdan noto'g'ri tilda javob berish
    AgentGaveUserInstructionsOrCodeToRunInsteadOfExecutingViaAvailableToolsDirectly.md  # foydalanuvchiga kod/yo'riqnoma berish, o'zi tool orqali bajarmaslik
    CreatedSkillWithShortOrAmbiguousFilenameInsteadOfLongDescriptiveName.md  # skill fayl nomi qisqa/noaniq, uzun aniq nom kerak
    AgentDidNotUseImageOnlyOrIncludeImageInWebSearchWhenUserRequestedPictures.md  # rasm so'rovida web_search image_only/include_image ishlatmaslik
    AgentDescribedImageContentWithoutCallingViewImageToolOnProvidedUrl.md  # rasm URL berilganda view_image chaqirmasdan tasvirlash
    AgentDidNotCleanPreviousSkillsRepoCloneInTmpBeforeRecloningLeadingToStaleOrConflictingState.md  # /tmp/skills-repo ni tozalamasdan qayta clone qilish, eski holat aralashadi
    AgentDidNotSearchExistingSkillsBeforeCreatingNewOneLeadingToDuplicatesOrInconsistentFormat.md  # mavjud skilllarni qidirmasdan yangi skill yaratish, takror yoki format xato
    AgentUsedWriteFileForPartialContentChangeInsteadOfEditFileCausingUnintendedFullOverwrite.md  # qisman o'zgarish kerak bo'lganda write_file ishlatish, to'liq overwrite
    AgentIncludedRawUnprocessedToolOutputOrStackTraceInFinalUserResponseInsteadOfCleanSummary.md  # xom tool output/stack trace ni yakuniy javobga joylashtirish, toza xulosa o'rniga
  productivity/
    GeneratedLargeCodeBlockInChatInsteadOfWritingToArtifactsFile.md  # katta kod chatda, faylga yozilmagan
    AgentChoseComplexPathWhenDirectReliableToolExisted.md  # to'g'ridan-to'g'ri tool/buyruq bor bo'lsa ham murakkab brauzer/UI yo'li tanlandi
    RecomputedExpensiveOperationMultipleTimesInSameScopeWithoutMemoization.md  # bir xil qimmat operatsiyani qayta-qayta hisoblash, memoization yo'q
    AgentPerformedManualFileOperationsWithCatEchoSedInsteadOfUsingDedicatedReadWriteEditTools.md  # matn fayllarini shell (cat/echo/sed) bilan, dedicated tool o'rniga
    AgentProvidedExcessivelyLongResponseForStraightforwardQueryInsteadOfConciseAnswer.md  # oddiy so'rovga haddan tashqari uzun javob
    VagueWebSearchQueryProducedLowRelevanceResultsInsteadOfPreciseOperators.md  # noaniq qidiruv so'rovi past relevantlik
    AgentLeftTemporaryFilesOrClonesInTmpWithoutCleanupAfterTask.md  # /tmp dagi vaqtinchalik papka/fayllarni vazifa oxirida tozalamagan

Skillar ataylab **juda tor va bitta nuqtaga qaratilgan**: har biri faqat
BITTA aniq simptom (masalan "aynan shu xato matni", "aynan shu holat") →
BITTA aniq sabab → BITTA aniq tuzatishdan iborat. Umumiy "yaxshi kod yozish"
maslahatlari yo'q — maqsad shuki, Claude biror xatoga duch kelganda,
`search_skills` orqali mos skillni topib, uni o'qib chiqishi bilanoq —
boshqa variantlarni tekshirib o'tirmasdan — aynan sababni va tuzatishni
bir o'qishda tushunib olishi. `error-handling.md` va `focus.md` bundan
mustasno — ular bitta bug turi emas, umumiy debug jarayoni bo'yicha
meta-qoidalar, shuning uchun kengroq qoladi.

**Fayl nomlash qoidasi:** har bir skill faylining nomi o'zi nima haqida
ekanini bildirib turadi (masalan
`VercelListenInsteadOfHandlerExportCauses404OnAllRoutes.md`) — uzun
bo'lsa ham mayli, qisqartma yoki noaniq nom ishlatilmaydi. Har bir skill
faylining o'zi ham bir xil qolipda yoziladi:

- **Header — "Nima uchun bu skill kerak":** bu skill qachon kerak
  bo'lishi, boshqa o'xshash skillardan nimasi bilan farqlanishi.
- **Section — asosiy qism:** Simptom (aynan shu) → Sabab (100%) →
  Tasdiqlash → Tuzatish (aynan shu).
- **Footer — "Xulosa":** shu skillni o'qigach nimani bilib olgani, 2-3
  qisqa band bilan.

Har bir skill fayl frontmatter bilan boshlanadi:

```md
---
name: coding-error-handling
description: Qisqa tavsif — qachon kerak bo'lishi
---

Skillning to'liq matni shu yerda.
```

Uchta tool shuni boshqaradi:

- **`list_skills`** — barcha skillarning id + qisqa tavsifini qaytaradi
  (to'liq matnsiz — engil, kontekstni to'ldirmaydi).
- **`get_skill`** — bitta skillning to'liq matnini `id` bo'yicha qaytaradi
  (masalan `coding/error-handling`).
- **`search_skills`** — `query` so'zi/iborasi bo'yicha **id, sarlavha,
  tavsif VA to'liq matn ichidan** qidiradi. Masalan `query: "vercel"`
  desa, ichida "vercel" so'zi uchraydigan barcha skill fayllar (id +
  tavsif + topilgan joy atrofidagi qisqa snippet) qaytadi. Bu Claude
  aniq skill id'ni bilmasa-yu, faqat xato matni yoki mavzu bilan qidirmoqchi
  bo'lsa kerak bo'ladi — `list_skills`dan farqli, matn ichini ham qamrab
  oladi, faqat tavsifni emas.

Claude texnik vazifa boshida — agar aniq xato matni/kalit so'z bo'lsa —
avval `search_skills`ni, aks holda `list_skills`ni chaqiradi, keyin faqat
kerakli skill(lar)ni `get_skill` bilan o'qiydi — hammasini birdan emas.
Yangi skill qo'shish uchun `skills/<papka>/<nom>.md` faylini shu formatda
yozib qo'yish yetarli, kodga tegish shart emas — `search_skills` va
`list_skills` avtomatik ko'radi.

# Qanday deploy qilish

1. Shu papkadagi fayllarni GitHub repo'ga push qil — struktura shunday
   bo'lishi kerak:
   ```
   /index.html
   /instruction.md
   /token.md
   /package.json
   /vercel.json
   /api/index.js
   /skills/coding/GeneralDebuggingProcessWhenCodeErrorsOrBreaks.md
   /skills/coding/StayScopedToRequestedTaskAvoidUnrequestedChanges.md
   /skills/coding/vercel/VercelListenInsteadOfHandlerExportCauses404OnAllRoutes.md
   /skills/coding/vercel/VercelCustomRouteNotMatchingApiFilenameReturns404MissingRewrites.md
   /skills/coding/vercel/VercelRuntimeReadFileEnoentMissingIncludeFilesConfig.md
   /skills/coding/vercel/VercelEntireProjectServedAsStaticSiteMissingApiOrVercelJson.md
   /skills/coding/async/AsyncFunctionReturnsPendingPromiseInsteadOfValueMissingAwait.md
   /skills/coding/async/ArrayMapWithAsyncCallbackReturnsPromiseArrayNotValues.md
   /skills/coding/async/UnhandledPromiseRejectionCrashMissingTryCatchAroundAwait.md
   /skills/coding/async/AsyncRaceConditionDependentTasksStartedInParallelWithPromiseAll.md
   /skills/coding/null/CannotReadPropertiesOfUndefinedOrNullTypeErrorDiagnosis.md
   /skills/coding/null/FalsyZeroOrEmptyStringWronglyTreatedAsMissingValueBug.md
   ```
2. Vercel avtomatik qayta deploy qiladi (yoki `vercel --prod`).
3. Tekshirish:
   - `https://<domain>/health` → `{"ok":true,...}` qaytishi kerak.
   - `https://<domain>/mcp?k=<TOKEN>` — Claude connector shu URL bilan
     ulanadi, endi OAuth "register" xatosiz o'tishi kerak.
4. Claude'da connectorni qayta ulashga harakat qil ("Connect" tugmasi).

Eslatma: bu hali "haqiqiy" OAuth emas — token statik va ochiq holda
kodda yozilgan. Bu faqat shaxsiy loyiha uchun yetarli, lekin tokenni
public repo'da oshkora qoldirish xavfsiz emas — xohlasang buni keyin
`.env` / Vercel environment variable'ga o'tkazamiz.
